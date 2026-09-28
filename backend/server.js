import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { testConnection } from './config/database.js';
import pool from './config/database.js';
import { getRedisClient } from './config/redis.js';
import { validateTablesAtStartup } from './config/tableValidator.js';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { securityMiddleware } from './middleware/security.js';
import { redisRateLimiter } from './middleware/redisRateLimiter.js';
import { sanitizeInput } from './middleware/validator.js';
import { timeoutMiddleware } from './middleware/timeout.js';
import { validatePagination } from './middleware/pagination.js';
import { metricsMiddleware, getMetrics } from './config/metrics.js';
import { startQueueWorker } from './workers/queueWorker.js';
import multer from 'multer';
import { createMagicNumberFilter } from './middleware/fileValidator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import magazineRoutes from './routes/magazines.js';
import storyRoutes from './routes/stories.js';
import podcastRoutes from './routes/podcasts.js';
import merchandiseRoutes from './routes/merchandise.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import userRoutes from './routes/users.js';
import contributorRoutes from './routes/contributors.js';
import podcastHostRoutes from './routes/podcastHosts.js';
import podcastGuestApplicationRoutes from './routes/podcastGuestApplications.js';
import advertisementRoutes from './routes/advertisements.js';
import inquiryRoutes from './routes/inquiries.js';
import pitchRoutes from './routes/pitches.js';
import partnerRoutes from './routes/partners.js';
import eventRoutes from './routes/events.js';
import contactRoutes from './routes/contact.js';
import authorRoutes from './routes/authors.js';
import teamRoutes from './routes/team.js';
import galleryRoutes from './routes/gallery.js';
import analyticsRoutes from './routes/analytics.js';
import opportunityRoutes from './routes/opportunities.js';

const app = express();

// Trust X-Forwarded-* headers when running behind a load balancer/reverse proxy
if (process.env.TRUST_PROXY === 'true' || process.env.NODE_ENV === 'production') {
  app.set('trust proxy', true);
}

const PORT = process.env.PORT || 3001;

// Security middleware
app.use(securityMiddleware);
app.use(corsMiddleware);
app.use(compression());

// Request timeout (60 seconds)
app.use(timeoutMiddleware(60000));

// Use Redis rate limiter if available, fallback to in-memory
app.use(redisRateLimiter);

// Collect request metrics for APM
app.use(metricsMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing middleware
app.use(cookieParser());

// Input sanitization
app.use(sanitizeInput);

// Configure multer for memory storage (for database uploads)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit (reduced from 50MB for security)
  },
  fileFilter: createMagicNumberFilter(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'audio/mpeg', 'audio/mp3', 'video/mp4', 'application/pdf'])
});

// Serve static files from backend uploads directory with CORS and security headers
const backendUploadsPath = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(backendUploadsPath)) {
  fs.mkdirSync(backendUploadsPath, { recursive: true });
  // Create subdirectories
  const subdirs = ['profiles', 'stories', 'magazines', 'podcasts', 'merchandise'];
  subdirs.forEach(dir => {
    const dirPath = path.join(backendUploadsPath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
}

app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  // Security headers for static files
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Cache control for static assets
  res.header('Cache-Control', 'public, max-age=31536000, immutable');
  res.header('CDN-Cache-Control', 'public, max-age=31536000, immutable');
  res.header('Vary', 'Accept-Encoding');
  next();
}, express.static(backendUploadsPath));

// Security request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`${timestamp} - ${ip} - ${req.method} ${req.path}`);
  
  // Log suspicious activity
  if (req.path.includes('..') || req.path.includes('%2e%2e')) {
    console.warn(`⚠️  Suspicious path traversal attempt from ${ip}: ${req.path}`);
  }
  
  next();
});

// Health check endpoint for load balancers
app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

// Readiness check for Kubernetes/load balancers
app.get('/api/ready', async (req, res) => {
  const dbConnected = await testConnection();
  
  if (dbConnected) {
    res.json({ ready: true });
  } else {
    res.status(503).json({ ready: false, reason: 'database disconnected' });
  }
});

// Redis health check endpoint
app.get('/api/redis-health', async (req, res) => {
  try {
    const client = await getRedisClient();
    
    if (client) {
      await client.set('health-check', 'ok');
      const value = await client.get('health-check');
      res.json({ 
        success: true,
        redis: 'connected', 
        test: value,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({ 
        success: false,
        redis: 'disconnected',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(503).json({ 
      success: false,
      redis: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Monitoring / metrics endpoint
app.get('/api/metrics', async (req, res) => {
  try {
    const data = await getMetrics();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API Routes with versioning
const API_VERSION = process.env.API_VERSION || 'v1';

app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/magazines`, magazineRoutes);
app.use(`/api/${API_VERSION}/stories`, storyRoutes);
app.use(`/api/${API_VERSION}/podcasts`, podcastRoutes);
app.use(`/api/${API_VERSION}/podcast-hosts`, podcastHostRoutes);
app.use(`/api/${API_VERSION}/podcast-guest-applications`, podcastGuestApplicationRoutes);
app.use(`/api/${API_VERSION}/merchandise`, merchandiseRoutes);
app.use(`/api/${API_VERSION}/products`, merchandiseRoutes); // Alias for frontend compatibility
app.use(`/api/${API_VERSION}/orders`, orderRoutes);
app.use(`/api/${API_VERSION}/payments`, paymentRoutes);
app.use(`/api/${API_VERSION}/contributors`, contributorRoutes);
app.use(`/api/${API_VERSION}/advertisements`, advertisementRoutes);
app.use(`/api/${API_VERSION}/inquiries`, inquiryRoutes);
app.use(`/api/${API_VERSION}/pitches`, pitchRoutes);
app.use(`/api/${API_VERSION}/partners`, partnerRoutes);
app.use(`/api/${API_VERSION}/events`, eventRoutes);
app.use(`/api/${API_VERSION}/contact`, contactRoutes);
app.use(`/api/${API_VERSION}/authors`, authorRoutes);
app.use(`/api/${API_VERSION}/team`, teamRoutes);
app.use(`/api/${API_VERSION}/gallery`, galleryRoutes);
app.use(`/api/${API_VERSION}/analytics`, analyticsRoutes);
app.use(`/api/${API_VERSION}/opportunities`, opportunityRoutes);

// Legacy API routes (backward compatibility - will be deprecated)
app.use('/api/users', userRoutes);
app.use('/api/magazines', magazineRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/podcasts', podcastRoutes);
app.use('/api/podcast-hosts', podcastHostRoutes);
app.use('/api/podcast-guest-applications', podcastGuestApplicationRoutes);
app.use('/api/merchandise', merchandiseRoutes);
app.use('/api/products', merchandiseRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contributors', contributorRoutes);
app.use('/api/advertisements', advertisementRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/pitches', pitchRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/opportunities', opportunityRoutes);

// Make upload middleware available to routes
app.set('upload', upload);

// Serve frontend build for production / CDN with aggressive cache on hashed assets
const frontendDistPath = path.join(__dirname, '../frontend/dist');
const hasFrontendDist = fs.existsSync(frontendDistPath);

if (hasFrontendDist) {
  app.use(express.static(frontendDistPath, {
    index: false,
    immutable: true,
    maxAge: '1y',
    setHeaders: (res, filePath) => {
      if (path.basename(filePath) === 'index.html') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
      res.setHeader('CDN-Cache-Control', res.getHeader('Cache-Control'));
      res.setHeader('Vary', 'Accept-Encoding');
    }
  }));

  // SPA fallback: only for non-API, non-upload routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Create advertisement_inquiries table if it doesn't exist
const createInquiriesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS advertisement_inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        budget VARCHAR(50),
        campaign_type VARCHAR(100),
        message TEXT,
        status ENUM('pending', 'contacted', 'in_progress', 'completed', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_email (email),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('Advertisement inquiries table checked/created successfully');
  } catch (error) {
    console.error('Error creating advertisement_inquiries table:', error);
  }
};

// Start server
const startServer = async () => {
  try {
    // Validate critical environment variables
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET environment variable is not set.');
      console.error('The server cannot start without a JWT secret for authentication.');
      console.error('Please set JWT_SECRET in your .env file or environment variables.');
      console.error('You can generate a secure JWT secret using: node scripts/generateJwtSecret.js');
      process.exit(1);
    }

    if (process.env.JWT_SECRET === 'your_jwt_secret_here_use_strong_random_string' || 
        process.env.JWT_SECRET === 'your_jwt_secret_here') {
      console.error('CRITICAL: JWT_SECRET is set to the default placeholder value.');
      console.error('This is not secure for production. Please generate a secure JWT secret.');
      console.error('You can generate a secure JWT secret using: node scripts/generateJwtSecret.js');
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      } else {
        console.warn('WARNING: Running with default JWT secret in development mode. This should be changed before production deployment.');
      }
    }

    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.warn('Warning: Database connection failed. Server will start but database operations will fail.');
    } else {
      // Validate all required tables at startup
      await validateTablesAtStartup();
      // Create tables if they don't exist
      await createInquiriesTable();
    }
    
    startQueueWorker();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API Base URL: http://localhost:${PORT}/api`);
      console.log(`Network access: http://192.168.100.4:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
