import pool from '../config/database.js';

async function addFourthImageColumn() {
  try {
    console.log('Adding 4th image column to stories table...');
    
    // Check if column already exists
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'stories' 
      AND TABLE_SCHEMA = DATABASE()
    `);
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    console.log('Existing columns:', columnNames);
    
    if (columnNames.includes('featured_image_url_4')) {
      console.log('Column already exists, skipping migration');
      process.exit(0);
    }
    
    // Add the 4th image column
    console.log('Adding featured_image_url_4 column...');
    await pool.query('ALTER TABLE stories ADD COLUMN featured_image_url_4 VARCHAR(500) AFTER featured_image_url_3');
    
    console.log('Migration completed successfully!');
    console.log('Added featured_image_url_4 column to stories table');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

addFourthImageColumn();
