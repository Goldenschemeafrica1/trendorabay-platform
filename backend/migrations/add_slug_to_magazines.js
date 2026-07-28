import pool from '../config/database.js';

// Function to create a URL-friendly slug from a title
function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

async function addSlugColumn() {
  try {
    console.log('Starting migration to add slug column to magazines table...');

    // Add slug column to magazines table (without UNIQUE constraint for TiDB compatibility)
    await pool.query('ALTER TABLE magazines ADD COLUMN slug VARCHAR(255) AFTER title');
    console.log('Slug column added successfully');

    // Generate slugs for existing magazines
    const [magazines] = await pool.query('SELECT id, title FROM magazines');
    
    for (const magazine of magazines) {
      let slug = createSlug(magazine.title);
      
      // Check if slug already exists and make it unique if needed
      let counter = 1;
      let originalSlug = slug;
      
      while (true) {
        const [existing] = await pool.query('SELECT id FROM magazines WHERE slug = ?', [slug]);
        if (existing.length === 0) break;
        
        slug = `${originalSlug}-${counter}`;
        counter++;
      }
      
      await pool.query('UPDATE magazines SET slug = ? WHERE id = ?', [slug, magazine.id]);
      console.log(`Generated slug "${slug}" for magazine ID ${magazine.id}`);
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

addSlugColumn();
