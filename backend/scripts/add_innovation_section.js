import pool from '../config/database.js';

async function addInnovationSection() {
  try {
    console.log('Adding innovation section...');

    // Step 1: Temporarily allow any string value
    await pool.query(
      `ALTER TABLE stories MODIFY COLUMN display_section VARCHAR(50) DEFAULT 'featured'`
    );
    console.log('Step 1: Changed column to VARCHAR(50)');

    // Step 2: Change back to ENUM with innovation included
    await pool.query(
      `ALTER TABLE stories MODIFY COLUMN display_section ENUM('featured', 'horizontal', 'must_read', 'text_only', 'innovation') DEFAULT 'featured'`
    );
    console.log('Step 2: Added innovation to ENUM values');

    // Step 3: Update the schema file
    console.log('✅ innovation section added successfully!');

    // Verify the changes
    const [counts] = await pool.query(
      'SELECT display_section, COUNT(*) as count FROM stories GROUP BY display_section'
    );

    console.log('\nSection counts after update:');
    counts.forEach(row => {
      console.log(`${row.display_section}: ${row.count}`);
    });
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

addInnovationSection();
