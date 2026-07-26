import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all inquiries
router.get('/', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM advertisement_inquiries WHERE 1=1';
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

// Get inquiry by ID
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM advertisement_inquiries WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Create inquiry
router.post('/', async (req, res, next) => {
  try {
    console.log('Received inquiry submission');
    const { name, company, email, phone, budget, campaignType, message } = req.body;
    
    // Validate required fields
    if (!name || !company || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: name, company, email are required' 
      });
    }
    
    console.log('Attempting to insert inquiry into database');
    const [result] = await pool.query(
      `INSERT INTO advertisement_inquiries (name, company, email, phone, budget, campaign_type, message) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, company, email, phone, budget, campaignType, message]
    );
    console.log('Inquiry inserted successfully');
    
    const [newInquiry] = await pool.query(
      'SELECT * FROM advertisement_inquiries WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newInquiry[0] });
  } catch (error) {
    console.error('Inquiry submission error:', error);
    
    // Check if table doesn't exist
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ 
        success: false, 
        error: 'Database table does not exist. Please contact administrator.' 
      });
    }
    
    next(error);
  }
});

// Update inquiry status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    await pool.query(
      'UPDATE advertisement_inquiries SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    const [updated] = await pool.query(
      'SELECT * FROM advertisement_inquiries WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Delete inquiry
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM advertisement_inquiries WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
