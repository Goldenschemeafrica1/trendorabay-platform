import pool from '../config/database.js';

async function checkStoriesDisplaySection() {
  try {
    const [stories] = await pool.query(
      'SELECT id, title, display_section FROM stories LIMIT 20'
    );

    console.log('Stories display_section values:');
    stories.forEach(story => {
      console.log(`ID: ${story.id}, Title: "${story.title}", Section: ${story.display_section}`);
    });

    const [counts] = await pool.query(
      'SELECT display_section, COUNT(*) as count FROM stories GROUP BY display_section'
    );

    console.log('\nSection counts:');
    counts.forEach(row => {
      console.log(`${row.display_section}: ${row.count}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkStoriesDisplaySection();
