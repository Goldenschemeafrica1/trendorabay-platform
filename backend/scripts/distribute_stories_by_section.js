import pool from '../config/database.js';

async function distributeStoriesBySection() {
  try {
    console.log('Distributing stories across sections...');

    // Get all stories
    const [stories] = await pool.query(
      'SELECT id, title FROM stories ORDER BY id'
    );

    console.log(`Found ${stories.length} stories to distribute`);

    // Distribute stories across sections evenly
    const sections = ['featured', 'horizontal', 'must_read', 'text_only'];
    const sectionCounts = { featured: 0, horizontal: 0, must_read: 0, text_only: 0 };

    for (const story of stories) {
      // Find the section with the fewest stories
      let minSection = sections[0];
      let minCount = sectionCounts[minSection];

      for (const section of sections) {
        if (sectionCounts[section] < minCount) {
          minSection = section;
          minCount = sectionCounts[section];
        }
      }

      await pool.query(
        'UPDATE stories SET display_section = ? WHERE id = ?',
        [minSection, story.id]
      );
      sectionCounts[minSection]++;
      console.log(`Updated story "${story.title}" (ID: ${story.id}) to section: ${minSection}`);
    }

    console.log('\nFinal section counts:');
    for (const section of sections) {
      console.log(`${section}: ${sectionCounts[section]}`);
    }

    console.log('✅ Stories distributed successfully!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

distributeStoriesBySection();
