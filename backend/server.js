import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import { testConnection } from './config/database.js';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { securityMiddleware } from './middleware/security.js';
import { redisRateLimiter } from './middleware/redisRateLimiter.js';
import { sanitizeInput } from './middleware/validator.js';
import { timeoutMiddleware } from './middleware/timeout.js';
import { validatePagination } from './middleware/pagination.js';
import multer from 'multer';

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

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(securityMiddleware);
app.use(corsMiddleware);
app.use(compression());

// Request timeout (30 seconds)
app.use(timeoutMiddleware(30000));

// Use Redis rate limiter if available, fallback to in-memory
app.use(redisRateLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// Configure multer for memory storage (for database uploads)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit (reduced from 50MB for security)
  },
  fileFilter: (req, file, cb) => {
    // Basic file type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'audio/mpeg', 'audio/mp3', 'video/mp4', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Serve static files from CMS uploads directory with CORS and security headers
const cmsUploadsPath = process.env.UPLOADS_PATH || path.join(__dirname, '../../cms/backend/uploads');
const backendUploadsPath = path.join(__dirname, 'uploads');

app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  // Security headers for static files
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Cache control for static assets
  res.header('Cache-Control', 'public, max-age=31536000, immutable');
  next();
}, express.static(cmsUploadsPath));

// Serve static files from backend uploads directory with security headers
app.use('/uploads', (req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.header('Cache-Control', 'public, max-age=31536000, immutable');
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

// Make upload middleware available to routes
app.set('upload', upload);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.warn('Warning: Database connection failed. Server will start but database operations will fail.');
    }
    
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
