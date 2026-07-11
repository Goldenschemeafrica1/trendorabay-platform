import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all partnership proposals
router.get('/', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM partnership_proposals WHERE 1=1';
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

// Get proposal by ID
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM partnership_proposals WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Proposal not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Create partnership proposal
router.post('/', async (req, res, next) => {
  try {
    const { companyName, contactPerson, email, phone, partnershipType, message } = req.body;
    const [result] = await pool.query(
      `INSERT INTO partnership_proposals (company_name, contact_person, email, phone, partnership_type, message) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [companyName, contactPerson, email, phone, partnershipType, message]
    );
    const [newProposal] = await pool.query(
      'SELECT * FROM partnership_proposals WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newProposal[0] });
  } catch (error) {
    next(error);
  }
});

// Update proposal status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    await pool.query(
      'UPDATE partnership_proposals SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    const [updated] = await pool.query(
      'SELECT * FROM partnership_proposals WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Delete proposal
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM partnership_proposals WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, message: 'Proposal deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
