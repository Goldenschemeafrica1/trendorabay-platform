import pool from '../config/database.js';

const createInquiriesTable = async () => {
  try {
    // Create advertisement inquiries table
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
    console.log('Advertisement inquiries table created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error creating inquiries table:', error);
    process.exit(1);
  }
};

createInquiriesTable();
