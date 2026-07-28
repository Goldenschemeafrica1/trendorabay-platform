import pool from '../config/database.js';

async function runSlugMigration() {
  try {
    console.log('Starting slug migration...');
    
    // Add slug column to stories table if it doesn't exist
    await pool.query(`
      ALTER TABLE stories 
      ADD COLUMN IF NOT EXISTS slug VARCHAR(255)
    `);
    console.log('✓ Added slug column to stories table');
    
    // Update existing stories to generate slugs from titles
    const [result] = await pool.query(`
      UPDATE stories 
      SET slug = LOWER(TRIM(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '/', '-'), '_', '-')))
      WHERE slug IS NULL OR slug = ''
    `);
    console.log(`✓ Updated ${result.affectedRows} stories with slugs`);
    
    // Ensure slug is unique by appending ID if necessary
    await pool.query(`
      UPDATE stories s1
      SET slug = CONCAT(s1.slug, '-', s1.id)
      WHERE s1.id IN (
          SELECT s2.id FROM stories s2
          WHERE s2.slug IN (
              SELECT slug FROM stories GROUP BY slug HAVING COUNT(*) > 1
          )
      )
    `);
    console.log('✓ Ensured slug uniqueness');
    
    console.log('Slug migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Slug migration failed:', error.message);
    process.exit(1);
  }
}

runSlugMigration();
