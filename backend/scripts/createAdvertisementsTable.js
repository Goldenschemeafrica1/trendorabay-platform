import pool from '../config/database.js';

const createAdvertisementsTable = async () => {
  try {
    // Create advertisements table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS advertisements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        link_url VARCHAR(500),
        position ENUM('horizontal', 'vertical', 'banner') DEFAULT 'horizontal',
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Advertisements table created successfully');

    // Insert sample advertisements
    await pool.query(`
      INSERT INTO advertisements (title, image_url, link_url, position, status) VALUES
      ('Featured Product', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=300&fit=crop', '/store', 'horizontal', 'active'),
      ('Special Offer', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=600&fit=crop', '/store', 'vertical', 'active')
      ON DUPLICATE KEY UPDATE title=VALUES(title)
    `);
    console.log('Sample advertisements inserted successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error creating advertisements table:', error);
    process.exit(1);
  }
};

createAdvertisementsTable();
