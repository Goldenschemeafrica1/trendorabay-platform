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

    console.log('Like request - user_id:', user_id, 'story_id:', story_id);

    // Check table structure to determine which columns to use
    const [columns] = await pool.query('DESCRIBE likes');
    const columnNames = columns.map(c => c.Field);
    console.log('Likes table columns:', columnNames);

    const hasPolymorphicColumns = columnNames.includes('likeable_id') && columnNames.includes('likeable_type');
    const hasStoryIdColumn = columnNames.includes('story_id');

    let existing, insertQuery, deleteQuery, countQuery;

    if (hasPolymorphicColumns) {
      // Use new polymorphic structure
      existing = await pool.query(
        'SELECT * FROM likes WHERE user_id = ? AND likeable_id = ? AND likeable_type = ?',
        [user_id, story_id, 'story']
      );
      insertQuery = 'INSERT INTO likes (user_id, likeable_id, likeable_type) VALUES (?, ?, ?)';
      deleteQuery = 'DELETE FROM likes WHERE user_id = ? AND likeable_id = ? AND likeable_type = ?';
      countQuery = 'SELECT COUNT(*) as count FROM likes WHERE likeable_id = ? AND likeable_type = ?';
    } else if (hasStoryIdColumn) {
      // Use old story_id column for backward compatibility
      existing = await pool.query(
        'SELECT * FROM likes WHERE user_id = ? AND story_id = ?',
        [user_id, story_id]
      );
      insertQuery = 'INSERT INTO likes (user_id, story_id) VALUES (?, ?)';
      deleteQuery = 'DELETE FROM likes WHERE user_id = ? AND story_id = ?';
      countQuery = 'SELECT COUNT(*) as count FROM likes WHERE story_id = ?';
    } else {
      return res.status(500).json({ success: false, error: 'Likes table has invalid structure' });
    }

    if (existing[0].length > 0) {
      await pool.query(deleteQuery, hasPolymorphicColumns ? [user_id, story_id, 'story'] : [user_id, story_id]);
      const [likes] = await pool.query(countQuery, hasPolymorphicColumns ? [story_id, 'story'] : [story_id]);
      return res.json({ success: true, liked: false, likes: likes[0].count });
    } else {
      await pool.query(insertQuery, hasPolymorphicColumns ? [user_id, story_id, 'story'] : [user_id, story_id]);
      const [likes] = await pool.query(countQuery, hasPolymorphicColumns ? [story_id, 'story'] : [story_id]);
      return res.json({ success: true, liked: true, likes: likes[0].count });
    }
  } catch (error) {
    console.error('Like error:', error);
    next(error);
  }
});

router.get('/:id/likes', async (req, res, next) => {
  try {
    if (!getTableStatus('likes')) {
      return res.json({ success: true, likes: 0 });
    }

    // Check table structure
    const [columns] = await pool.query('DESCRIBE likes');
    const columnNames = columns.map(c => c.Field);

    const hasPolymorphicColumns = columnNames.includes('likeable_id') && columnNames.includes('likeable_type');
    const hasStoryIdColumn = columnNames.includes('story_id');

    let query, params;

    if (hasPolymorphicColumns) {
      query = 'SELECT COUNT(*) as count FROM likes WHERE likeable_id = ? AND likeable_type = ?';
      params = [req.params.id, 'story'];
    } else if (hasStoryIdColumn) {
      query = 'SELECT COUNT(*) as count FROM likes WHERE story_id = ?';
      params = [req.params.id];
    } else {
      return res.json({ success: true, likes: 0 });
    }

    const [likes] = await pool.query(query, params);
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

    // Check table structure
    const [columns] = await pool.query('DESCRIBE comments');
    const columnNames = columns.map(c => c.Field);

    const hasPolymorphicColumns = columnNames.includes('commentable_id') && columnNames.includes('commentable_type');
    const hasStoryIdColumn = columnNames.includes('story_id');

    let insertQuery, insertParams;

    if (hasPolymorphicColumns) {
      insertQuery = 'INSERT INTO comments (user_id, commentable_id, commentable_type, content, parent_id) VALUES (?, ?, ?, ?, ?)';
      insertParams = [user_id, story_id, 'story', content, parent_id || null];
    } else if (hasStoryIdColumn) {
      insertQuery = 'INSERT INTO comments (user_id, story_id, content, parent_id) VALUES (?, ?, ?, ?)';
      insertParams = [user_id, story_id, content, parent_id || null];
    } else {
      return res.status(500).json({ success: false, error: 'Comments table has invalid structure' });
    }

    const [result] = await pool.query(insertQuery, insertParams);

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

    // Check table structure
    const [columns] = await pool.query('DESCRIBE comments');
    const columnNames = columns.map(c => c.Field);

    const hasPolymorphicColumns = columnNames.includes('commentable_id') && columnNames.includes('commentable_type');
    const hasStoryIdColumn = columnNames.includes('story_id');

    let query, params;

    if (hasPolymorphicColumns) {
      query = `SELECT c.*, u.username, u.email
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.commentable_id = ? AND c.commentable_type = ? AND c.parent_id IS NULL
       ORDER BY c.created_at DESC`;
      params = [req.params.id, 'story'];
    } else if (hasStoryIdColumn) {
      query = `SELECT c.*, u.username, u.email
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.story_id = ? AND c.parent_id IS NULL
       ORDER BY c.created_at DESC`;
      params = [req.params.id];
    } else {
      return res.json({ success: true, data: [] });
    }

    const [comments] = await pool.query(query, params);
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

    // Check if shares table exists
    const [tableCheck] = await pool.query('SHOW TABLES LIKE ?', ['shares']);

    if (tableCheck.length > 0) {
      await pool.query(
        'INSERT INTO shares (likeable_id, user_id, platform, likeable_type) VALUES (?, ?, ?, ?)',
        [story_id, user_id, platform, 'story']
      );

      const [shares] = await pool.query(
        'SELECT COUNT(*) as count FROM shares WHERE likeable_id = ? AND likeable_type = ?',
        [story_id, 'story']
      );

      res.json({ success: true, shares: shares[0].count });
    } else {
      // If shares table doesn't exist, just return success without tracking
      res.json({ success: true, shares: 0 });
    }
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
