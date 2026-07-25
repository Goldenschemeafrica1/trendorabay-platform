import pool from '../config/database.js';

async function addAllImageColumns() {
  try {
    console.log('Adding image columns to stories table...');
    
    // Check existing columns
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'stories' 
      AND TABLE_SCHEMA = DATABASE()
    `);
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    console.log('Existing columns:', columnNames);
    
    // Add featured_image_url_2 if it doesn't exist
    if (!columnNames.includes('featured_image_url_2')) {
      console.log('Adding featured_image_url_2 column...');
      await pool.query('ALTER TABLE stories ADD COLUMN featured_image_url_2 VARCHAR(500) AFTER featured_image_url');
      console.log('featured_image_url_2 added successfully');
    } else {
      console.log('featured_image_url_2 already exists, skipping');
    }
    
    // Add featured_image_url_3 if it doesn't exist
    if (!columnNames.includes('featured_image_url_3')) {
      console.log('Adding featured_image_url_3 column...');
      await pool.query('ALTER TABLE stories ADD COLUMN featured_image_url_3 VARCHAR(500) AFTER featured_image_url_2');
      console.log('featured_image_url_3 added successfully');
    } else {
      console.log('featured_image_url_3 already exists, skipping');
    }
    
    // Add featured_image_url_4 if it doesn't exist
    if (!columnNames.includes('featured_image_url_4')) {
      console.log('Adding featured_image_url_4 column...');
      await pool.query('ALTER TABLE stories ADD COLUMN featured_image_url_4 VARCHAR(500) AFTER featured_image_url_3');
      console.log('featured_image_url_4 added successfully');
    } else {
      console.log('featured_image_url_4 already exists, skipping');
    }
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

addAllImageColumns();
