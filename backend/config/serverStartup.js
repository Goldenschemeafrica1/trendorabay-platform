import { testConnection } from './database.js';
import pool from './database.js';
import { validateTablesAtStartup } from './tableValidator.js';
import { startQueueWorker } from '../workers/queueWorker.js';

async function createInquiriesTable() {
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
}

export async function startServer(app, PORT) {
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
      await validateTablesAtStartup();
      await createInquiriesTable();
    }
    
    startQueueWorker();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
