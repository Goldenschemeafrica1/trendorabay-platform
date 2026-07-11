import pool from '../config/database.js';

async function runMigration() {
  try {
    console.log('Starting migration...');
    
    // Add role column to authors table
    await pool.query(`
      ALTER TABLE authors 
      ADD COLUMN IF NOT EXISTS role VARCHAR(100) DEFAULT 'Author'
    `);
    console.log('✓ Added role column to authors table');
    
    // Add read_time column to stories table
    await pool.query(`
      ALTER TABLE stories 
      ADD COLUMN IF NOT EXISTS read_time VARCHAR(50) DEFAULT '5 min read'
    `);
    console.log('✓ Added read_time column to stories table');
    
    // Add views column to stories table
    await pool.query(`
      ALTER TABLE stories 
      ADD COLUMN IF NOT EXISTS views INT DEFAULT 0
    `);
    console.log('✓ Added views column to stories table');
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
