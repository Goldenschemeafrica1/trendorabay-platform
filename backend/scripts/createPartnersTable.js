import pool from '../config/database.js';

const createPartnersTable = async () => {
  try {
    // Create partnership proposals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS partnership_proposals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        contact_person VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        partnership_type VARCHAR(100) NOT NULL,
        message TEXT,
        status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Partnership proposals table created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error creating partners table:', error);
    process.exit(1);
  }
};

createPartnersTable();
