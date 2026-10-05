import express from 'express';
import pool from '../../config/database.js';
import auth from '../../middleware/auth.js';
import { getTableStatus } from '../../config/tableValidator.js';
import { StoryService } from '../../services/storyService.js';

const router = express.Router();

router.post('/:id/like', auth, async (req, res, next) => {
  try {
    const user_id = req.userId;
    const story_id = req.params.id;

    const [existing] = await pool.query(
      'SELECT * FROM likes WHERE user_id = ? AND story_id = ?',
      [user_id, story_id]
    );

    if (existing.length > 0) {
      await pool.query(
        'DELETE FROM likes WHERE user_id = ? AND story_id = ?',
        [user_id, story_id]
      );
      const [likes] = await pool.query(
        'SELECT COUNT(*) as count FROM likes WHERE story_id = ?',
        [story_id]
      );
      return res.json({ success: true, liked: false, likes: likes[0].count });
    } else {
      await pool.query(
        'INSERT INTO likes (user_id, story_id) VALUES (?, ?)',
        [user_id, story_id]
      );
      const [likes] = await pool.query(
        'SELECT COUNT(*) as count FROM likes WHERE story_id = ?',
        [story_id]
      );
      return res.json({ success: true, liked: true, likes: likes[0].count });
    }
  } catch (error) {
    next(error);
  }
});

router.get('/:id/likes', async (req, res, next) => {
  try {
    if (!getTableStatus('likes')) {
      return res.json({ success: true, likes: 0 });
    }

    const [likes] = await pool.query(
      'SELECT COUNT(*) as count FROM likes WHERE story_id = ?',
      [req.params.id]
    );
    res.json({ success: true, likes: likes[0].count });
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.json({ success: true, likes: 0 });
  }
});

router.post('/:id/comments', auth, async (req, res, next) => {
  try {
    const user_id = req.userId;
    const { content, parent_id } = req.body;
    const story_id = req.params.id;

    if (!getTableStatus('comments')) {
      return res.status(500).json({ success: false, error: 'Comments table does not exist' });
    }

    const [result] = await pool.query(
      'INSERT INTO comments (user_id, story_id, content, parent_id) VALUES (?, ?, ?, ?)',
      [user_id, story_id, content, parent_id || null]
    );

    const [comment] = await pool.query(
      `SELECT c.*, u.username, u.email
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    );

    res.json({ success: true, data: comment[0] });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, error: 'Failed to add comment' });
  }
});

router.get('/:id/comments', async (req, res, next) => {
  try {
    if (!getTableStatus('comments')) {
      return res.json({ success: true, data: [] });
    }

    const [comments] = await pool.query(
      `SELECT c.*, u.username, u.email
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.story_id = ? AND c.parent_id IS NULL
       ORDER BY c.created_at DESC`,
      [req.params.id]
    );
    res.json({ success: true, data: comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.json({ success: true, data: [] });
  }
});

router.post('/:id/share', async (req, res, next) => {
  try {
    const { user_id, platform } = req.body;
    const story_id = req.params.id;

    await pool.query(
      'INSERT INTO shares (story_id, user_id, platform) VALUES (?, ?, ?)',
      [story_id, user_id, platform]
    );

    const [shares] = await pool.query(
      'SELECT COUNT(*) as count FROM shares WHERE story_id = ?',
      [story_id]
    );

    res.json({ success: true, shares: shares[0].count });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/view', async (req, res, next) => {
  try {
    const views = await StoryService.incrementViews(req.params.id);
    res.json({ success: true, views });
  } catch (error) {
    next(error);
  }
});

export default router;
