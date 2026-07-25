import pool from '../config/database.js';

async function runMigration() {
  try {
    console.log('Starting migration...');
    
    // Check if columns already exist
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'stories' 
      AND TABLE_SCHEMA = DATABASE()
    `);
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    console.log('Existing columns:', columnNames);
    
    if (columnNames.includes('featured_image_url_2') && columnNames.includes('featured_image_url_3')) {
      console.log('Columns already exist, skipping migration');
      process.exit(0);
    }
    
    // Add columns one at a time
    if (!columnNames.includes('featured_image_url_2')) {
      console.log('Adding featured_image_url_2 column...');
      await pool.query('ALTER TABLE stories ADD COLUMN featured_image_url_2 VARCHAR(500) AFTER featured_image_url');
    }
    
    if (!columnNames.includes('featured_image_url_3')) {
      console.log('Adding featured_image_url_3 column...');
      await pool.query('ALTER TABLE stories ADD COLUMN featured_image_url_3 VARCHAR(500) AFTER featured_image_url_2');
    }
    
    console.log('Migration completed successfully!');
    console.log('Added featured_image_url_2 and featured_image_url_3 columns to stories table');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
