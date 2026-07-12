import pool from '../config/database.js';

async function updateAdvertisementImages() {
  try {
    // Show current advertisements
    const [ads] = await pool.query('SELECT id, title, image_url FROM advertisements');
    console.log('Current advertisements:');
    ads.forEach(ad => {
      console.log(`ID: ${ad.id}, Title: ${ad.title}, Image URL: ${ad.image_url}`);
    });

    // Update local paths to Cloudinary URLs
    // Replace YOUR_CLOUD_NAME with your actual Cloudinary cloud name
    const cloudinaryBaseUrl = 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload';

    console.log('\nTo update advertisements to use Cloudinary URLs:');
    console.log('1. Replace YOUR_CLOUD_NAME in this script with your actual Cloudinary cloud name');
    console.log('2. Run this script: node scripts/updateAdvertisementImages.js');
    console.log('3. Or manually update the image_url in your database to Cloudinary URLs');
    console.log('\nExample Cloudinary URL format:');
    console.log('https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/advertisements/ad-1783534663125-552364087.png');

    process.exit(0);
  } catch (error) {
    console.error('Error updating advertisements:', error);
    process.exit(1);
  }
}

updateAdvertisementImages();
