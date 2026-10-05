import pool from '../config/database.js';

const updateStoriesStatus = async () => {
  try {
    // Update all stories to published status
    const [result] = await pool.query(`
      UPDATE stories 
      SET status = 'published', published_at = NOW() 
      WHERE status = 'draft'
    `);
    
    console.log(`Updated ${result.affectedRows} stories to published status`);
    
    // Check how many published stories we have now
    const [stories] = await pool.query(`
      SELECT COUNT(*) as count FROM stories WHERE status = 'published'
    `);
    
    console.log(`Total published stories: ${stories[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating stories status:', error);
    process.exit(1);
  }
};

updateStoriesStatus();
