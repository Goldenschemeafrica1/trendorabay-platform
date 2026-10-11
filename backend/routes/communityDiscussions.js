import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get discussions for a community
router.get('/community/:communityId', async (req, res, next) => {
  try {
    const { communityId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [rows] = await pool.query(
      `SELECT cd.*, u.username, u.first_name, u.last_name, u.profile_image,
       (SELECT COUNT(*) FROM community_discussion_replies WHERE discussion_id = cd.id) as replies_count
       FROM community_discussions cd
       INNER JOIN users u ON cd.user_id = u.id
       WHERE cd.community_id = ? AND cd.status = 'active'
       ORDER BY cd.created_at DESC
       LIMIT ? OFFSET ?`,
      [communityId, parseInt(limit), offset]
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching community discussions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single discussion with replies
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [discussion] = await pool.query(
      `SELECT cd.*, u.username, u.first_name, u.last_name, u.profile_image
       FROM community_discussions cd
       INNER JOIN users u ON cd.user_id = u.id
       WHERE cd.id = ? AND cd.status = 'active'`,
      [id]
    );

    if (discussion.length === 0) {
      return res.status(404).json({ success: false, error: 'Discussion not found' });
    }

    // Get replies
    const [replies] = await pool.query(
      `SELECT cdr.*, u.username, u.first_name, u.last_name, u.profile_image
       FROM community_discussion_replies cdr
       INNER JOIN users u ON cdr.user_id = u.id
       WHERE cdr.discussion_id = ?
       ORDER BY cdr.created_at ASC`,
      [id]
    );

    // Increment view count
    await pool.query(
      'UPDATE community_discussions SET views = views + 1 WHERE id = ?',
      [id]
    );

    res.json({ success: true, data: { ...discussion[0], replies } });
  } catch (error) {
    console.error('Error fetching discussion:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new discussion
router.post('/', async (req, res, next) => {
  try {
    const { community_id, user_id, title, content, tag } = req.body;

    if (!community_id || !user_id || !title || !content) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Check if user is a member of the community
    const [membership] = await pool.query(
      'SELECT * FROM community_members WHERE user_id = ? AND community_id = ? AND status = "active"',
      [user_id, community_id]
    );

    if (membership.length === 0) {
      return res.status(403).json({ success: false, error: 'You must join this community to post discussions' });
    }

    const [result] = await pool.query(
      `INSERT INTO community_discussions (community_id, user_id, title, content, tag)
       VALUES (?, ?, ?, ?, ?)`,
      [community_id, user_id, title, content, tag || null]
    );

    const [newDiscussion] = await pool.query(
      `SELECT cd.*, u.username, u.first_name, u.last_name, u.profile_image
       FROM community_discussions cd
       INNER JOIN users u ON cd.user_id = u.id
       WHERE cd.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, data: newDiscussion[0] });
  } catch (error) {
    console.error('Error creating discussion:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add reply to a discussion
router.post('/:id/replies', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id, content } = req.body;

    if (!user_id || !content) {
      return res.status(400).json({ success: false, error: 'User ID and content required' });
    }

    const [result] = await pool.query(
      `INSERT INTO community_discussion_replies (discussion_id, user_id, content)
       VALUES (?, ?, ?)`,
      [id, user_id, content]
    );

    const [newReply] = await pool.query(
      `SELECT cdr.*, u.username, u.first_name, u.last_name, u.profile_image
       FROM community_discussion_replies cdr
       INNER JOIN users u ON cdr.user_id = u.id
       WHERE cdr.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, data: newReply[0] });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
