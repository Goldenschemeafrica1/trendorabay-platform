import 'dotenv/config';
import pool from '../config/database.js';

async function fixNullSlugs() {
  try {
    console.log('Checking for stories with null/empty slugs...');

    // Find all stories with null or empty slugs
    const [stories] = await pool.query(
      'SELECT id, title, slug FROM stories WHERE slug IS NULL OR slug = ""'
    );

    if (stories.length === 0) {
      console.log('No stories with null/empty slugs found.');
      return;
    }

    console.log(`Found ${stories.length} stories with null/empty slugs. Fixing...`);

    for (const story of stories) {
      const cleanTitle = story.title?.trim() || '';
      let slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || String(story.id);

      // Check if slug already exists and make it unique if needed
      let counter = 1;
      let originalSlug = slug;

      while (true) {
        const [existing] = await pool.query(
          'SELECT id FROM stories WHERE slug = ? AND id != ?',
          [slug, story.id]
        );
        if (existing.length === 0) break;

        slug = `${originalSlug}-${counter}`;
        counter++;
      }

      await pool.query(
        'UPDATE stories SET slug = ? WHERE id = ?',
        [slug, story.id]
      );

      console.log(`✓ Fixed story ID ${story.id}: "${story.title}" -> slug: "${slug}"`);
    }

    console.log('\nAll null/empty slugs have been fixed!');
  } catch (error) {
    console.error('Error fixing null slugs:', error);
    process.exit(1);
  }
}

fixNullSlugs().then(() => {
  console.log('Script completed successfully.');
  process.exit(0);
});
