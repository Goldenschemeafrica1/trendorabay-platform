import pool from '../config/database.js';

const deleteMusicCommunityPosts = async () => {
  try {
    console.log('Finding music community...');
    
    // Find the music community by slug
    const [communities] = await pool.query(
      'SELECT id, name, slug FROM communities WHERE slug = ?',
      ['music']
    );

    if (communities.length === 0) {
      console.log('Music community not found');
      process.exit(0);
    }

    const musicCommunity = communities[0];
    console.log(`Found music community: ${musicCommunity.name} (ID: ${musicCommunity.id})`);

    // Get count of posts before deletion
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as count FROM community_posts WHERE community_id = ?',
      [musicCommunity.id]
    );
    const postCount = countResult[0].count;
    console.log(`Total posts to delete: ${postCount}`);

    if (postCount === 0) {
      console.log('No posts found in music community');
      process.exit(0);
    }

    // Delete all posts from the music community
    // This will cascade delete likes and comments due to foreign key constraints
    const [result] = await pool.query(
      'DELETE FROM community_posts WHERE community_id = ?',
      [musicCommunity.id]
    );

    console.log(`Deleted ${result.affectedRows} posts from music community`);

    // Update the community's post_count
    await pool.query(
      'UPDATE communities SET post_count = 0 WHERE id = ?',
      [musicCommunity.id]
    );

    console.log('Updated community post_count to 0');
    console.log('All posts in music community have been deleted successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error deleting music community posts:', error);
    process.exit(1);
  }
};

deleteMusicCommunityPosts();
