import pool from '../config/database.js';

async function addBadgeColumns() {
  try {
    console.log('Adding badge columns to merchandise table...');
    
    // Add badge column
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS badge VARCHAR(100) DEFAULT NULL
    `);
    console.log('✓ Added badge column');
    
    // Add badge_color column
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS badge_color VARCHAR(50) DEFAULT NULL
    `);
    console.log('✓ Added badge_color column');
    
    console.log('✓ Badge columns added successfully!');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Columns already exist, skipping...');
      process.exit(0);
    }
    console.error('Error adding badge columns:', error);
    process.exit(1);
  }
}

addBadgeColumns();
