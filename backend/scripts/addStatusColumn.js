import pool from '../config/database.js';

const addStatusColumn = async () => {
  try {
    // Check if status column exists
    const [columns] = await pool.query(`
      SHOW COLUMNS FROM advertisements LIKE 'status'
    `);
    
    if (columns.length === 0) {
      // Add status column
      await pool.query(`
        ALTER TABLE advertisements 
        ADD COLUMN status ENUM('active', 'inactive') DEFAULT 'active' AFTER position
      `);
      console.log('status column added successfully');
    } else {
      console.log('status column already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding status column:', error);
    process.exit(1);
  }
};

addStatusColumn();
