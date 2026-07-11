import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all hosts
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM podcast_hosts';
    const params = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Get host by ID
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM podcast_hosts WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Host not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get host's podcasts
router.get('/:id/podcasts', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM podcasts WHERE host_id = ? ORDER BY published_at DESC',
      [req.params.id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Create host
router.post('/', async (req, res, next) => {
  try {
    const { name, bio, photo_url, twitter, instagram, linkedin, status } = req.body;
    const [result] = await pool.query(
      `INSERT INTO podcast_hosts (name, bio, photo_url, twitter, instagram, linkedin, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, bio, photo_url, twitter, instagram, linkedin, status || 'active']
    );
    const [newHost] = await pool.query(
      'SELECT * FROM podcast_hosts WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newHost[0] });
  } catch (error) {
    next(error);
  }
});

// Update host
router.put('/:id', async (req, res, next) => {
  try {
    const { name, bio, photo_url, twitter, instagram, linkedin, status } = req.body;
    await pool.query(
      `UPDATE podcast_hosts 
       SET name = ?, bio = ?, photo_url = ?, twitter = ?, instagram = ?, linkedin = ?, status = ?
       WHERE id = ?`,
      [name, bio, photo_url, twitter, instagram, linkedin, status, req.params.id]
    );
    const [updated] = await pool.query(
      'SELECT * FROM podcast_hosts WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Delete host
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM podcast_hosts WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Host deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get featured guests
router.get('/featured/list', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const [rows] = await pool.query(
      `SELECT * FROM podcast_guests 
       WHERE status = 'active'
       ORDER BY created_at DESC 
       LIMIT ?`,
      [limit]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

export default router;
