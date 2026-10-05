import pool from '../config/database.js';

async function checkAllDisplaySections() {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT display_section FROM stories'
    );

    console.log('All display_section values in database:');
    rows.forEach(row => {
      console.log(`- ${row.display_section}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkAllDisplaySections();
