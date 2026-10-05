import { getRedisClient } from '../config/redis.js';

// In-memory fallback rate limiter
const inMemoryRateLimit = new Map();

const getInMemoryCount = (key, windowMs) => {
  const now = Date.now();
  const record = inMemoryRateLimit.get(key);
  
  if (!record || now - record.timestamp > windowMs) {
    inMemoryRateLimit.set(key, { count: 1, timestamp: now });
    return 1;
  }
  
  record.count++;
  return record.count;
};

const cleanupOldRecords = (windowMs) => {
  const now = Date.now();
  for (const [key, record] of inMemoryRateLimit.entries()) {
    if (now - record.timestamp > windowMs) {
      inMemoryRateLimit.delete(key);
    }
  }
};

// Clean up old records every 5 minutes
setInterval(() => cleanupOldRecords(15 * 60 * 1000), 5 * 60 * 1000);

export const redisRateLimiter = async (req, res, next) => {
  try {
    const client = await getRedisClient();
    const ip = req.ip || req.connection.remoteAddress;
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 1000; // Increased from 300 to 1000
    let current;

    if (client && client.isOpen) {
      const key = `ratelimit:${ip}`;
      current = await client.incr(key);

      if (current === 1) {
        await client.expire(key, windowMs / 1000);
      }

      if (current > maxRequests) {
        console.warn(`Rate limit exceeded for IP: ${ip}, count: ${current}`);
        return res.status(429).json({
          success: false,
          error: 'Too many requests from this IP, please try again later.',
          retryAfter: await client.ttl(key)
        });
      }

      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - current);
      res.setHeader('X-RateLimit-Reset', await client.ttl(key));
    } else {
      // Fallback to in-memory rate limiting
      const key = `ratelimit:${ip}`;
      current = getInMemoryCount(key, windowMs);

      if (current > maxRequests) {
        console.warn(`Rate limit exceeded for IP: ${ip}, count: ${current}`);
        return res.status(429).json({
          success: false,
          error: 'Too many requests from this IP, please try again later.'
        });
      }

      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - current);
      res.setHeader('X-RateLimit-Reset', Math.ceil(windowMs / 1000));
    }

    next();
  } catch (error) {
    console.error('Redis rate limiter error:', error.message);
    // Fallback to in-memory rate limiting on error
    const ip = req.ip || req.connection.remoteAddress;
    const windowMs = 15 * 60 * 1000;
    const maxRequests = 1000; // Increased from 300 to 1000
    const key = `ratelimit:${ip}`;
    const current = getInMemoryCount(key, windowMs);

    if (current > maxRequests) {
      console.warn(`Rate limit exceeded for IP: ${ip}, count: ${current}`);
      return res.status(429).json({
        success: false,
        error: 'Too many requests from this IP, please try again later.'
      });
    }

    next();
  }
};

export const redisAuthLimiter = async (req, res, next) => {
  try {
    const client = await getRedisClient();
    const ip = req.ip || req.connection.remoteAddress;
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 5;
    let current;

    if (client && client.isOpen) {
      const key = `authlimit:${ip}`;
      current = await client.incr(key);

      if (current === 1) {
        await client.expire(key, windowMs / 1000);
      }

      if (current > maxRequests) {
        console.warn(`Auth rate limit exceeded for IP: ${ip}, count: ${current}`);
        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', await client.ttl(key));
        return res.status(429).json({
          success: false,
          error: 'Too many authentication attempts, please try again later.',
          retryAfter: await client.ttl(key)
        });
      }

      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - current);
      res.setHeader('X-RateLimit-Reset', await client.ttl(key));
    } else {
      // Fallback to in-memory rate limiting
      const key = `authlimit:${ip}`;
      current = getInMemoryCount(key, windowMs);

      if (current > maxRequests) {
        console.warn(`Auth rate limit exceeded for IP: ${ip}, count: ${current}`);
        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', Math.ceil(windowMs / 1000));
        return res.status(429).json({
          success: false,
          error: 'Too many authentication attempts, please try again later.'
        });
      }

      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - current);
      res.setHeader('X-RateLimit-Reset', Math.ceil(windowMs / 1000));
    }

    next();
  } catch (error) {
    console.error('Redis auth limiter error:', error);
    // Fallback to in-memory rate limiting on error
    const ip = req.ip || req.connection.remoteAddress;
    const windowMs = 15 * 60 * 1000;
    const maxRequests = 5;
    const key = `authlimit:${ip}`;
    const current = getInMemoryCount(key, windowMs);

    if (current > maxRequests) {
      console.warn(`Auth rate limit exceeded for IP: ${ip}, count: ${current}`);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', Math.ceil(windowMs / 1000));
      return res.status(429).json({
        success: false,
        error: 'Too many authentication attempts, please try again later.'
      });
    }

    next();
  }
};
