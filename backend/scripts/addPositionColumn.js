import pool from '../config/database.js';

const addPositionColumn = async () => {
  try {
    // Check if position column exists
    const [columns] = await pool.query(`
      SHOW COLUMNS FROM advertisements LIKE 'position'
    `);
    
    if (columns.length === 0) {
      // Add position column
      await pool.query(`
        ALTER TABLE advertisements 
        ADD COLUMN position ENUM('horizontal', 'vertical', 'banner') DEFAULT 'horizontal' AFTER link_url
      `);
      console.log('position column added successfully');
    } else {
      console.log('position column already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding position column:', error);
    process.exit(1);
  }
};

addPositionColumn();
