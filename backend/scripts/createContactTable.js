import pool from '../config/database.js';

const createContactTable = async () => {
  try {
    // Create contact messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('pending', 'read', 'replied', 'archived') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Contact messages table created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error creating contact table:', error);
    process.exit(1);
  }
};

createContactTable();
