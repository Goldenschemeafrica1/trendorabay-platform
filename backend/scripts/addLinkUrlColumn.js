import pool from '../config/database.js';

const addLinkUrlColumn = async () => {
  try {
    // Check if link_url column exists
    const [columns] = await pool.query(`
      SHOW COLUMNS FROM advertisements LIKE 'link_url'
    `);
    
    if (columns.length === 0) {
      // Add link_url column
      await pool.query(`
        ALTER TABLE advertisements 
        ADD COLUMN link_url VARCHAR(500) AFTER image_url
      `);
      console.log('link_url column added successfully');
    } else {
      console.log('link_url column already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding link_url column:', error);
    process.exit(1);
  }
};

addLinkUrlColumn();
