import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create primary database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trendorabay',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 50,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  acquireTimeout: 60000,
  timeout: 60000,
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
    connectionLimit: parseInt(process.env.DB_READ_REPLICA_CONNECTION_LIMIT) || 50,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    acquireTimeout: 60000,
    timeout: 60000,
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

// Test connection
const testConnection = async () => {
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
    console.error('Database connection failed:', error.message);
    return false;
  }
};

export { pool, readPool, testConnection };
export default pool;
