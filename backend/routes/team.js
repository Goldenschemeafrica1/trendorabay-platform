import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all team members
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM team_members';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    console.log('Executing team query');
    const [rows] = await pool.query(query, params);
    console.log('Team members fetched successfully');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching team members:', error);
    next(error);
  }
});

// Get team member by ID
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM team_members WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Team member not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get active team members
router.get('/active', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const [rows] = await pool.query(
      'SELECT * FROM team_members WHERE status = "active" ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Get team members by role
router.get('/role/:role', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM team_members WHERE role = ? AND status = "active" ORDER BY created_at DESC',
      [req.params.role]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Create team member
router.post('/', async (req, res, next) => {
  try {
    const { name, role, avatar, bio, status, email, linkedin, twitter, instagram } = req.body;
    const [result] = await pool.query(
      `INSERT INTO team_members (name, role, avatar, bio, status, email, linkedin, twitter, instagram)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, role, avatar, bio, status || 'active', email, linkedin, twitter, instagram]
    );
    const [newMember] = await pool.query(
      'SELECT * FROM team_members WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newMember[0] });
  } catch (error) {
    next(error);
  }
});

// Update team member
router.put('/:id', async (req, res, next) => {
  try {
    const { name, role, avatar, bio, status, email, linkedin, twitter, instagram } = req.body;
    await pool.query(
      `UPDATE team_members
       SET name = ?, role = ?, avatar = ?, bio = ?, status = ?, email = ?, linkedin = ?, twitter = ?, instagram = ?
       WHERE id = ?`,
      [name, role, avatar, bio, status, email, linkedin, twitter, instagram, req.params.id]
    );
    const [updated] = await pool.query(
      'SELECT * FROM team_members WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Delete team member
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM team_members WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
