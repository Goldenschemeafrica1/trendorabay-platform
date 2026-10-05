import pool from '../config/database.js';

async function addAllSections() {
  try {
    console.log('Adding all sections to ENUM...');

    // Step 1: Temporarily allow any string value
    await pool.query(
      `ALTER TABLE stories MODIFY COLUMN display_section VARCHAR(50) DEFAULT 'featured'`
    );
    console.log('Step 1: Changed column to VARCHAR(50)');

    // Step 2: Change back to ENUM with all values
    await pool.query(
      `ALTER TABLE stories MODIFY COLUMN display_section ENUM('featured', 'horizontal', 'must_read', 'text_only', 'innovation', 'latest_stories') DEFAULT 'featured'`
    );
    console.log('Step 2: Added innovation and latest_stories to ENUM values');

    // Verify the changes
    const [counts] = await pool.query(
      'SELECT display_section, COUNT(*) as count FROM stories GROUP BY display_section'
    );

    console.log('\nSection counts after update:');
    counts.forEach(row => {
      console.log(`${row.display_section}: ${row.count}`);
    });

    console.log('✅ All sections added successfully!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

addAllSections();
