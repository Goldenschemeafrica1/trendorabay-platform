import { createClient } from 'redis';

let redisClient = null;
let isRedisAvailable = true;

export const getRedisClient = async () => {
  // If Redis is marked as unavailable, return null immediately
  if (!isRedisAvailable) {
    return null;
  }

  // If client exists and is connected, return it
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  // If client exists but is closed, reset it
  if (redisClient && !redisClient.isOpen) {
    redisClient = null;
  }

  // Skip Redis connection in production unless explicitly enabled
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_REDIS !== 'true') {
    if (!isRedisAvailable) {
      console.log('Redis disabled in production (set ENABLE_REDIS=true to enable)');
    }
    isRedisAvailable = false;
    return null;
  }

  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const redisPassword = process.env.REDIS_PASSWORD;

    const clientConfig = {
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('Redis reconnection failed after 10 retries, disabling Redis');
            isRedisAvailable = false;
            redisClient = null;
            return new Error('Redis reconnection failed');
          }
          return Math.min(retries * 100, 3000);
        },
        connectTimeout: 10000,
        lazyConnect: false
      }
    };

    // Add password if provided
    if (redisPassword) {
      clientConfig.password = redisPassword;
    }

    redisClient = createClient(clientConfig);

    redisClient.on('error', (err) => {
      // Only log error on first connection failure to reduce noise
      if (!isRedisAvailable) {
        console.error('Redis Client Error:', err.message);
      }
    });

    redisClient.on('connect', () => {
      console.log('Redis Client Connected');
      isRedisAvailable = true;
    });

    redisClient.on('disconnect', () => {
      // Reduce noise by not logging every disconnect
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error.message);
    isRedisAvailable = false;
    redisClient = null;
    // Return null if Redis is not available - app will work without caching
    return null;
  }
};

export const cacheGet = async (key) => {
  try {
    const client = await getRedisClient();
    if (!client) return null;
    
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

export const cacheSet = async (key, value, ttl = 300) => {
  try {
    const client = await getRedisClient();
    if (!client) return false;
    
    await client.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
};

export const cacheDel = async (key) => {
  try {
    const client = await getRedisClient();
    if (!client) return false;
    
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
};

export const cacheDelPattern = async (pattern) => {
  try {
    const client = await getRedisClient();
    if (!client) return false;
    
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
    return true;
  } catch (error) {
    console.error('Cache delete pattern error:', error);
    return false;
  }
};

export const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};
