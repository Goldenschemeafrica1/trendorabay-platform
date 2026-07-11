import pool from '../config/database.js';

async function updateAdvertisementImages() {
  try {
    // Update advertisements with empty image_url to use a default image
    const [result] = await pool.query(
      `UPDATE advertisements 
       SET image_url = '/uploads/advertisements/default-ad.jpg' 
       WHERE image_url = '' OR image_url IS NULL`
    );
    
    console.log(`Updated ${result.affectedRows} advertisements with default image`);
    
    // Show current advertisements
    const [ads] = await pool.query('SELECT id, title, image_url FROM advertisements');
    console.log('Current advertisements:', ads);
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating advertisements:', error);
    process.exit(1);
  }
}

updateAdvertisementImages();
