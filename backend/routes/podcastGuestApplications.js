import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Create guest application
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, bio, topic, social_media, status } = req.body;
    
    // Validate required fields
    if (!name || !email || !bio || !topic) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, bio, and topic are required' 
      });
    }

    const [result] = await pool.query(
      `INSERT INTO podcast_guest_applications (name, email, phone, bio, topic, social_media, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, bio, topic, social_media, status || 'pending']
    );
    
    const [newApplication] = await pool.query(
      'SELECT * FROM podcast_guest_applications WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({ success: true, data: newApplication[0] });
  } catch (error) {
    next(error);
  }
});

// Get all applications
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM podcast_guest_applications';
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

// Get application by ID
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM podcast_guest_applications WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Update application status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ 
        success: false, 
        error: 'Status is required' 
      });
    }
    
    await pool.query(
      'UPDATE podcast_guest_applications SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    
    const [updated] = await pool.query(
      'SELECT * FROM podcast_guest_applications WHERE id = ?',
      [req.params.id]
    );
    
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Delete application
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM podcast_guest_applications WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
