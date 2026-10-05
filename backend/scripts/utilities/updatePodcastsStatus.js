import pool from '../config/database.js';

const updatePodcastsStatus = async () => {
  try {
    // Update all podcasts to published status
    const [result] = await pool.query(`
      UPDATE podcasts 
      SET status = 'published', published_at = NOW() 
      WHERE status = 'draft'
    `);
    
    console.log(`Updated ${result.affectedRows} podcasts to published status`);
    
    // Check how many published podcasts we have now
    const [podcasts] = await pool.query(`
      SELECT COUNT(*) as count FROM podcasts WHERE status = 'published'
    `);
    
    console.log(`Total published podcasts: ${podcasts[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating podcasts status:', error);
    process.exit(1);
  }
};

updatePodcastsStatus();
