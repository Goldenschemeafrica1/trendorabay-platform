import pool from '../config/database.js';

const checkAllPodcasts = async () => {
  try {
    // Get all podcasts
    const [rows] = await pool.query('SELECT id, title, cover_art_url, audio_file_url FROM podcasts');
    console.log(`Total podcasts: ${rows.length}`);
    console.log('\nAll podcasts:');
    rows.forEach(row => {
      console.log(`ID: ${row.id}, Title: ${row.title}, Cover: ${row.cover_art_url}, Audio: ${row.audio_file_url}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking podcasts:', error);
    process.exit(1);
  }
};

checkAllPodcasts();
