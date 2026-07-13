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
    console.log('Starting migration to add slug column to stories table...');

    // Add slug column to stories table
    await pool.query('ALTER TABLE stories ADD COLUMN slug VARCHAR(255) UNIQUE AFTER title');
    console.log('Slug column added successfully');

    // Generate slugs for existing stories
    const [stories] = await pool.query('SELECT id, title FROM stories');
    
    for (const story of stories) {
      let slug = createSlug(story.title);
      
      // Check if slug already exists and make it unique if needed
      let counter = 1;
      let originalSlug = slug;
      
      while (true) {
        const [existing] = await pool.query('SELECT id FROM stories WHERE slug = ?', [slug]);
        if (existing.length === 0) break;
        
        slug = `${originalSlug}-${counter}`;
        counter++;
      }
      
      await pool.query('UPDATE stories SET slug = ? WHERE id = ?', [slug, story.id]);
      console.log(`Generated slug "${slug}" for story ID ${story.id}`);
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

addSlugColumn();
