import { cacheGet, cacheSet, cacheDel, cacheDelPattern } from '../config/redis.js';

// Cache middleware for GET requests
export const cache = (ttl = 300) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await cacheGet(key);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(cached);
      }
      
      res.setHeader('X-Cache', 'MISS');
      
      // Store original json method
      const originalJson = res.json.bind(res);
      
      // Override json method to cache response
      res.json = async (data) => {
        await cacheSet(key, data, ttl);
        return originalJson(data);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Invalidate cache for specific routes
export const invalidateCache = (pattern) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);
    
    res.json = async (data) => {
      // Invalidate cache after successful mutation
      if (res.statusCode < 400) {
        await cacheDelPattern(pattern);
      }
      return originalJson(data);
    };
    
    next();
  };
};

// Cache invalidation patterns for different resources
export const cachePatterns = {
  stories: 'cache:/api/stories*',
  magazines: 'cache:/api/magazines*',
  podcasts: 'cache:/api/podcasts*',
  contributors: 'cache:/api/contributors*',
  users: 'cache:/api/users*'
};
