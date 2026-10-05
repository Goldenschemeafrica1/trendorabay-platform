import express from 'express';
import { setupMiddleware } from './config/middleware.js';
import { setupRoutes } from './config/routes.js';
import { setupStaticFiles, configureMulter } from './config/staticFiles.js';
import { setupHealthChecks } from './config/healthChecks.js';
import { startServer } from './config/serverStartup.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Setup middleware
setupMiddleware(app);

// Setup static file serving
setupStaticFiles(app);

// Configure multer for file uploads
const upload = configureMulter();
app.set('upload', upload);

// Security request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`${timestamp} - ${ip} - ${req.method} ${req.path}`);
  
  if (req.path.includes('..') || req.path.includes('%2e%2e')) {
    console.warn(`⚠️  Suspicious path traversal attempt from ${ip}: ${req.path}`);
  }
  
  next();
});

// Setup health check endpoints
setupHealthChecks(app);

// Setup API routes
setupRoutes(app);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
startServer(app, PORT);

export default app;
