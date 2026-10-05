import pool from '../config/database.js';

async function updateStoriesDisplaySection() {
  try {
    console.log('Updating stories display_section...');

    // Get all stories without display_section or with null
    const [stories] = await pool.query(
      'SELECT id, title FROM stories WHERE display_section IS NULL OR display_section = ""'
    );

    console.log(`Found ${stories.length} stories to update`);

    // Distribute stories across sections
    const sections = ['featured', 'horizontal', 'must_read', 'text_only'];
    let sectionIndex = 0;

    for (const story of stories) {
      const section = sections[sectionIndex % sections.length];
      await pool.query(
        'UPDATE stories SET display_section = ? WHERE id = ?',
        [section, story.id]
      );
      console.log(`Updated story "${story.title}" (ID: ${story.id}) to section: ${section}`);
      sectionIndex++;
    }

    console.log('✅ All stories updated successfully!');
  } catch (error) {
    console.error('Error updating stories:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

updateStoriesDisplaySection();
