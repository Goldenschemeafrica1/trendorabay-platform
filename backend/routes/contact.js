import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all contact messages
router.get('/', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM contact_messages WHERE 1=1';
    const params = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Get message by ID
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM contact_messages WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Create contact message
router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const [result] = await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message) 
       VALUES (?, ?, ?, ?)`,
      [name, email, subject, message]
    );
    const [newMessage] = await pool.query(
      'SELECT * FROM contact_messages WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newMessage[0] });
  } catch (error) {
    next(error);
  }
});

// Update message status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    await pool.query(
      'UPDATE contact_messages SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    const [updated] = await pool.query(
      'SELECT * FROM contact_messages WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Delete message
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM contact_messages WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
