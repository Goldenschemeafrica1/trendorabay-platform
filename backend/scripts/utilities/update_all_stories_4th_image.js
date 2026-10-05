import pool from '../config/database.js';

async function updateAllStories4thImage() {
  try {
    console.log('Updating all stories to have 4 images...');
    
    // Get all stories that have a featured_image_url but missing the 4th image
    const [stories] = await pool.query(
      `SELECT id, featured_image_url 
       FROM stories 
       WHERE featured_image_url IS NOT NULL 
       AND featured_image_url != '' 
       AND (featured_image_url_4 IS NULL OR featured_image_url_4 = '')`
    );
    
    console.log(`Found ${stories.length} stories to update`);
    
    for (const story of stories) {
      await pool.query(
        `UPDATE stories 
         SET featured_image_url_4 = ? 
         WHERE id = ?`,
        [story.featured_image_url, story.id]
      );
      console.log(`Updated story ID: ${story.id}`);
    }
    
    console.log('Successfully updated all stories');
    process.exit(0);
  } catch (error) {
    console.error('Failed to update stories:', error);
    process.exit(1);
  }
}

updateAllStories4thImage();
