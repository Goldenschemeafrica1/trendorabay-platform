import pool from '../config/database.js';

async function addStoryImages() {
  try {
    console.log('Adding additional images to story...');
    
    // Update the story with additional image URLs
    const storyId = 75; // The story ID from the debug output
    
    await pool.query(
      `UPDATE stories 
       SET featured_image_url_2 = ?, 
           featured_image_url_3 = ? 
       WHERE id = ?`,
      [
        'https://res.cloudinary.com/z8oenh6r/image/upload/v1784376743/stories/1784376742890-African%20Masai%20culture.jpg',
        'https://res.cloudinary.com/z8oenh6r/image/upload/v1784376743/stories/1784376742890-African%20Masai%20culture.jpg',
        storyId
      ]
    );
    
    console.log('Successfully added additional images to story ID:', storyId);
    process.exit(0);
  } catch (error) {
    console.error('Failed to add images:', error);
    process.exit(1);
  }
}

addStoryImages();
