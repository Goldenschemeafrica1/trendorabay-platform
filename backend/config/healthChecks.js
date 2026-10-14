import { testConnection } from './database.js';
import { getRedisClient } from './redis.js';
import { getMetrics } from './metrics.js';
import queryMonitor from './queryMonitor.js';
import { getRedisStats } from './redis.js';
import { adminAuth, devOnly } from '../middleware/adminAuth.js';

export function setupHealthChecks(app) {
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

  // Query performance monitoring endpoint (protected)
  app.get('/api/query-performance', devOnly, async (req, res) => {
    try {
      const report = queryMonitor.getReport();
      const redisStats = await getRedisStats();
      
      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        queries: report,
        redis: redisStats
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Reset query monitoring stats (protected)
  app.post('/api/query-performance/reset', adminAuth, async (req, res) => {
    try {
      queryMonitor.reset();
      res.json({ success: true, message: 'Query monitoring stats reset' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
