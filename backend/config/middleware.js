import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from '../middleware/cors.js';
import { securityMiddleware } from '../middleware/security.js';
import { redisRateLimiter } from '../middleware/redisRateLimiter.js';
import { sanitizeInput } from '../middleware/validator.js';
import { timeoutMiddleware } from '../middleware/timeout.js';
import { metricsMiddleware } from './metrics.js';

export function setupMiddleware(app) {
  // Trust X-Forwarded-* headers when running behind a load balancer/reverse proxy
  if (process.env.TRUST_PROXY === 'true' || process.env.NODE_ENV === 'production') {
    app.set('trust proxy', true);
  }

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
}
