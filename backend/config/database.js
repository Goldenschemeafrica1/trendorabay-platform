import 'dotenv/config';
import mysql from 'mysql2/promise';
import { recordDbQuery } from './metrics.js';

// Create primary database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trendorabay',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  // Timeout settings to prevent hanging connections
  connectTimeout: 10000,
  // SSL/TLS configuration
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
  } : false
});

// Create read replica connection pool (if configured)
let readPool = null;

if (process.env.DB_READ_REPLICA_HOST) {
  readPool = mysql.createPool({
    host: process.env.DB_READ_REPLICA_HOST,
    port: process.env.DB_READ_REPLICA_PORT || 3306,
    user: process.env.DB_READ_REPLICA_USER || process.env.DB_USER || 'root',
    password: process.env.DB_READ_REPLICA_PASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.DB_READ_REPLICA_NAME || process.env.DB_NAME || 'trendorabay',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_READ_REPLICA_CONNECTION_LIMIT) || 20,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    // Timeout settings to prevent hanging connections
    connectTimeout: 10000,
    // SSL/TLS configuration
    ssl: process.env.DB_READ_REPLICA_SSL === 'true' ? {
      rejectUnauthorized: process.env.DB_READ_REPLICA_SSL_REJECT_UNAUTHORIZED !== 'false'
    } : false
  });
  console.log('Read replica pool configured');
}

// Get appropriate pool for read/write operations
export const getReadPool = () => {
  // Use read replica for read operations if available
  return readPool || pool;
};

export const getWritePool = () => {
  // Always use primary pool for write operations
  return pool;
};

// Read/write routing proxy
const isReadQuery = (sqlInput) => {
  const sql = (typeof sqlInput === 'string' ? sqlInput : sqlInput?.sql || '').trim().toLowerCase();
  return sql.startsWith('select') && !sql.includes('for update');
};

// Retry transient network/DNS/connection failures
const RETRYABLE_ERROR_CODES = new Set([
  'ENOTFOUND',
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'EPIPE',
  'PROTOCOL_CONNECTION_LOST'
]);

const isRetryableError = (error) => error && RETRYABLE_ERROR_CODES.has(error.code);

const withRetry = async (operation, maxRetries = 3) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isRetryableError(error) || i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, i), 4000)));
    }
  }
  throw lastError;
};

const routingPool = new Proxy(pool, {
  get(target, prop) {
    if (prop === 'query' || prop === 'execute') {
      return async (...args) => {
        const useRead = readPool && isReadQuery(args[0]);
        const start = Date.now();
        try {
          return await withRetry(() => (useRead ? readPool : target)[prop](...args));
        } finally {
          recordDbQuery(args[0], Date.now() - start);
        }
      };
    }
    return target[prop];
  }
});

// Test connection with retry logic
const testConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await pool.getConnection();
      console.log('Primary database connected successfully');
      connection.release();
      
      if (readPool) {
        const readConnection = await readPool.getConnection();
        console.log('Read replica connected successfully');
        readConnection.release();
      }
      
      return true;
    } catch (error) {
      console.error(`Database connection attempt ${i + 1} failed:`, error.message);
      if (i < retries - 1) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  console.error('Database connection failed after retries');
  return false;
};

export { pool, readPool, testConnection };
export default routingPool;
