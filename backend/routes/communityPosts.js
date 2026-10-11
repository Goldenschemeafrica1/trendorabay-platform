import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get posts for a community
router.get('/community/:communityId', async (req, res, next) => {
  try {
    const { communityId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [rows] = await pool.query(
      `SELECT cp.*, u.username, u.first_name, u.last_name, u.profile_image
       FROM community_posts cp
       INNER JOIN users u ON cp.user_id = u.id
       WHERE cp.community_id = ?
       ORDER BY cp.created_at DESC
       LIMIT ? OFFSET ?`,
      [communityId, parseInt(limit), offset]
    );

    // Add likes and comments counts to each post
    const postsWithCounts = await Promise.all(rows.map(async (post) => {
      const [likes] = await pool.query(
        'SELECT COUNT(*) as count FROM community_post_likes WHERE post_id = ?',
        [post.id]
      );
      const [comments] = await pool.query(
        'SELECT COUNT(*) as count FROM community_post_comments WHERE post_id = ?',
        [post.id]
      );
      return {
        ...post,
        likes_count: likes[0].count,
        comments_count: comments[0].count
      };
    }));

    res.json({ success: true, data: postsWithCounts });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single post with comments
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [posts] = await pool.query(
      `SELECT cp.*, u.username, u.first_name, u.last_name, u.profile_image
       FROM community_posts cp
       INNER JOIN users u ON cp.user_id = u.id
       WHERE cp.id = ?`,
      [id]
    );

    if (posts.length === 0) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const post = posts[0];

    // Get comments
    const [comments] = await pool.query(
      `SELECT cpc.*, u.username, u.first_name, u.last_name, u.profile_image
       FROM community_post_comments cpc
       INNER JOIN users u ON cpc.user_id = u.id
       WHERE cpc.post_id = ?
       ORDER BY cpc.created_at ASC`,
      [id]
    );

    res.json({ success: true, data: { ...post, comments } });
  } catch (error) {
    next(error);
  }
});

// Create a new post
router.post('/', async (req, res, next) => {
  try {
    const { community_id, user_id, content, image_url, poll_data } = req.body;

    if (!community_id || !user_id || !content) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Check if user is a member of the community
    const [membership] = await pool.query(
      'SELECT * FROM community_members WHERE user_id = ? AND community_id = ? AND status = "active"',
      [user_id, community_id]
    );

    if (membership.length === 0) {
      return res.status(403).json({ success: false, error: 'You must join this community to post' });
    }

    const [result] = await pool.query(
      `INSERT INTO community_posts (community_id, user_id, content, image_url, poll_data)
       VALUES (?, ?, ?, ?, ?)`,
      [community_id, user_id, content, image_url || null, poll_data ? JSON.stringify(poll_data) : null]
    );

    const [newPost] = await pool.query(
      `SELECT cp.*, u.username, u.first_name, u.last_name, u.profile_image
       FROM community_posts cp
       INNER JOIN users u ON cp.user_id = u.id
       WHERE cp.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, data: newPost[0] });
  } catch (error) {
    next(error);
  }
});

// Toggle like on a post
router.post('/:id/like', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'User ID required' });
    }

    // Check if already liked
    const [existing] = await pool.query(
      'SELECT * FROM community_post_likes WHERE post_id = ? AND user_id = ?',
      [id, user_id]
    );

    if (existing.length > 0) {
      // Unlike
      await pool.query(
        'DELETE FROM community_post_likes WHERE post_id = ? AND user_id = ?',
        [id, user_id]
      );
      await pool.query(
        'UPDATE community_posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = ?',
        [id]
      );
      res.json({ success: true, liked: false });
    } else {
      // Like
      await pool.query(
        'INSERT INTO community_post_likes (post_id, user_id) VALUES (?, ?)',
        [id, user_id]
      );
      await pool.query(
        'UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = ?',
        [id]
      );
      res.json({ success: true, liked: true });
    }
  } catch (error) {
    next(error);
  }
});

// Add comment to a post
router.post('/:id/comments', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id, content } = req.body;

    if (!user_id || !content) {
      return res.status(400).json({ success: false, error: 'User ID and content required' });
    }

    const [result] = await pool.query(
      `INSERT INTO community_post_comments (post_id, user_id, content)
       VALUES (?, ?, ?)`,
      [id, user_id, content]
    );

    await pool.query(
      'UPDATE community_posts SET comments_count = comments_count + 1 WHERE id = ?',
      [id]
    );

    const [newComment] = await pool.query(
      `SELECT cpc.*, u.username, u.first_name, u.last_name, u.profile_image
       FROM community_post_comments cpc
       INNER JOIN users u ON cpc.user_id = u.id
       WHERE cpc.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, data: newComment[0] });
  } catch (error) {
    next(error);
  }
});

// Delete a post
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'User ID required' });
    }

    // Check if user owns the post
    const [post] = await pool.query(
      'SELECT * FROM community_posts WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (post.length === 0) {
      return res.status(403).json({ success: false, error: 'You can only delete your own posts' });
    }

    await pool.query('DELETE FROM community_posts WHERE id = ?', [id]);
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
