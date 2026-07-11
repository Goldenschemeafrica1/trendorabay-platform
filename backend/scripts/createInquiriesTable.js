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
        budget VARCHAR(100) NOT NULL,
        campaign_type VARCHAR(100) NOT NULL,
        message TEXT,
        status ENUM('pending', 'reviewed', 'contacted', 'closed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Advertisement inquiries table created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error creating inquiries table:', error);
    process.exit(1);
  }
};

createInquiriesTable();
