import pool from '../config/database.js';

async function removeSlugAndExcerpt() {
  try {
    console.log('Starting migration to remove slug and excerpt columns...');
    
    // Remove slug column
    await pool.query('ALTER TABLE stories DROP COLUMN IF EXISTS slug');
    console.log('Slug column removed successfully');
    
    // Remove excerpt column
    await pool.query('ALTER TABLE stories DROP COLUMN IF EXISTS excerpt');
    console.log('Excerpt column removed successfully');
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

removeSlugAndExcerpt();
