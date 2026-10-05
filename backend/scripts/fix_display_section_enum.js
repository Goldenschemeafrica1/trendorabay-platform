import pool from '../config/database.js';

async function fixDisplaySectionEnum() {
  try {
    console.log('Fixing display_section column...');

    // Step 1: Temporarily allow any string value
    await pool.query(
      `ALTER TABLE stories MODIFY COLUMN display_section VARCHAR(50) DEFAULT 'featured'`
    );
    console.log('Step 1: Changed column to VARCHAR(50)');

    // Step 2: Update existing values to match new ENUM
    await pool.query(
      `UPDATE stories SET display_section = 'featured' WHERE display_section = 'default'`
    );
    console.log('Step 2: Updated "default" to "featured"');

    await pool.query(
      `UPDATE stories SET display_section = 'must_read' WHERE display_section = 'innovation'`
    );
    console.log('Step 3: Updated "innovation" to "must_read"');

    // Step 3: Change back to ENUM with correct values
    await pool.query(
      `ALTER TABLE stories MODIFY COLUMN display_section ENUM('featured', 'horizontal', 'must_read', 'text_only') DEFAULT 'featured'`
    );
    console.log('Step 4: Changed column back to ENUM with correct values');

    // Verify the changes
    const [counts] = await pool.query(
      'SELECT display_section, COUNT(*) as count FROM stories GROUP BY display_section'
    );

    console.log('\nSection counts after update:');
    counts.forEach(row => {
      console.log(`${row.display_section}: ${row.count}`);
    });

    console.log('✅ display_section column fixed successfully!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

fixDisplaySectionEnum();
