import pool from '../../config/database.js';
import auth from '../../middleware/auth.js';
import express from 'express';

const router = express.Router();

// Get user's communities
router.get('/communities', auth, async (req, res) => {
  try {
    const userId = req.userId;
    
    const [communities] = await pool.query(
      `SELECT c.id, c.name, c.description, c.slug, cm.joined_at
       FROM communities c
       INNER JOIN community_members cm ON c.id = cm.community_id
       WHERE cm.user_id = ?
       ORDER BY cm.joined_at DESC`,
      [userId]
    );
    
    res.json({ success: true, data: communities });
  } catch (error) {
    console.error('Error fetching user communities:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch communities' });
  }
});

// Get user's posts (from community_posts)
router.get('/posts', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    const [posts] = await pool.query(
      `SELECT cp.id, cp.content, cp.image_url, cp.likes_count, cp.comments_count, cp.created_at,
              c.name as community_name, c.slug as community_slug
       FROM community_posts cp
       LEFT JOIN communities c ON cp.community_id = c.id
       WHERE cp.user_id = ?
       ORDER BY cp.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM community_posts WHERE user_id = ?',
      [userId]
    );
    
    console.log('User posts for user', userId, ':', posts.length, 'posts');
    res.json({ 
      success: true, 
      data: posts,
      total: countResult[0].total
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch posts' });
  }
});

// Get user's saved items
router.get('/saved', auth, async (req, res) => {
  try {
    const userId = req.userId;
    
    const [saved] = await pool.query(
      `SELECT id, item_type, item_id, title, source, saved_at
       FROM saved_items
       WHERE user_id = ?
       ORDER BY saved_at DESC`,
      [userId]
    );
    
    res.json({ success: true, data: saved });
  } catch (error) {
    console.error('Error fetching saved items:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch saved items' });
  }
});

// Remove saved item
router.delete('/saved/:id', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    
    await pool.query(
      'DELETE FROM saved_items WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    res.json({ success: true, message: 'Item removed from saved' });
  } catch (error) {
    console.error('Error removing saved item:', error);
    res.status(500).json({ success: false, error: 'Failed to remove item' });
  }
});

// Get user's activity
router.get('/activity', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 10;
    
    const [activity] = await pool.query(
      `SELECT id, activity_type, activity_text, related_id, related_type, created_at
       FROM user_activity
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [userId, limit]
    );
    
    res.json({ success: true, data: activity });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch activity' });
  }
});

// Get user's stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.userId;
    
    const [postsCount] = await pool.query(
      'SELECT COUNT(*) as count FROM community_posts WHERE user_id = ?',
      [userId]
    );
    
    const [discussionsCount] = await pool.query(
      'SELECT COUNT(*) as count FROM community_discussions WHERE user_id = ?',
      [userId]
    );
    
    const [communitiesCount] = await pool.query(
      'SELECT COUNT(*) as count FROM community_members WHERE user_id = ?',
      [userId]
    );
    
    const [followersCount] = await pool.query(
      'SELECT COUNT(*) as count FROM follows WHERE following_id = ?',
      [userId]
    );
    
    const [followingCount] = await pool.query(
      'SELECT COUNT(*) as count FROM follows WHERE follower_id = ?',
      [userId]
    );
    
    res.json({
      success: true,
      data: {
        posts: postsCount[0].count,
        discussions: discussionsCount[0].count,
        communities: communitiesCount[0].count,
        followers: followersCount[0].count,
        following: followingCount[0].count
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

export default router;
