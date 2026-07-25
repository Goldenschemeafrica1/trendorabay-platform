import pool from '../config/database.js';

async function updateAllStoriesImages() {
  try {
    console.log('Updating all stories to have 3 images...');
    
    // Get all stories that have a featured_image_url but missing the additional images
    const [stories] = await pool.query(
      `SELECT id, featured_image_url 
       FROM stories 
       WHERE featured_image_url IS NOT NULL 
       AND featured_image_url != '' 
       AND (featured_image_url_2 IS NULL OR featured_image_url_2 = '')`
    );
    
    console.log(`Found ${stories.length} stories to update`);
    
    for (const story of stories) {
      await pool.query(
        `UPDATE stories 
         SET featured_image_url_2 = ?, 
             featured_image_url_3 = ? 
         WHERE id = ?`,
        [story.featured_image_url, story.featured_image_url, story.id]
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

updateAllStoriesImages();
