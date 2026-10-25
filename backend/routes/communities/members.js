import express from 'express';
import pool from '../../config/database.js';

const router = express.Router();

// Get community members
router.get('/:id/members', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.first_name, u.last_name, u.location, u.avatar,
              cm.role, cm.joined_at
       FROM community_members cm
       JOIN users u ON cm.user_id = u.id
       WHERE cm.community_id = ? AND cm.status = 'active'
       ORDER BY cm.joined_at DESC`,
      [req.params.id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Join community
router.post('/:id/join', async (req, res, next) => {
  try {
    const { user_id } = req.body;
    
    // Check if already a member
    const [existing] = await pool.query(
      'SELECT * FROM community_members WHERE community_id = ? AND user_id = ?',
      [req.params.id, user_id]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ success: false, error: 'Already a member' });
    }
    
    await pool.query(
      `INSERT INTO community_members (community_id, user_id, role, status, joined_at)
       VALUES (?, ?, 'member', 'active', NOW())`,
      [req.params.id, user_id]
    );
    
    // Update member count
    await pool.query(
      'UPDATE communities SET member_count = member_count + 1 WHERE id = ?',
      [req.params.id]
    );
    
    res.json({ success: true, message: 'Joined community successfully' });
  } catch (error) {
    next(error);
  }
});

// Leave community
router.post('/:id/leave', async (req, res, next) => {
  try {
    const { user_id } = req.body;
    
    await pool.query(
      'DELETE FROM community_members WHERE community_id = ? AND user_id = ?',
      [req.params.id, user_id]
    );
    
    // Update member count
    await pool.query(
      'UPDATE communities SET member_count = member_count - 1 WHERE id = ?',
      [req.params.id]
    );
    
    res.json({ success: true, message: 'Left community successfully' });
  } catch (error) {
    next(error);
  }
});



export default router;
