import pool from '../config/database.js';

const setFeaturedGuestFlag = async () => {
  try {
    // Update podcasts with guests to be featured guests
    const [result] = await pool.query(`
      UPDATE podcasts 
      SET is_featured_guest = 1 
      WHERE guest IS NOT NULL AND guest != ''
    `);
    
    console.log(`Updated ${result.affectedRows} podcasts to be featured guests`);
    
    // Verify the update
    const [rows] = await pool.query(`
      SELECT id, title, guest, is_featured_guest 
      FROM podcasts 
      WHERE guest IS NOT NULL
    `);
    
    console.log('\nPodcasts with guests:');
    rows.forEach(row => {
      console.log(`ID: ${row.id}, Title: ${row.title}, Guest: ${row.guest}, Is Featured: ${row.is_featured_guest}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting featured guest flag:', error);
    process.exit(1);
  }
};

setFeaturedGuestFlag();
