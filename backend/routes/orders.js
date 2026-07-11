import express from 'express';
import pool from '../config/database.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all orders
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, u.email as user_email 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Get order by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { email } = req.query;
    let query = `
      SELECT o.*, u.email as user_email 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      WHERE o.id = ?
    `;
    const params = [req.params.id];
    
    if (email) {
      query += ' AND u.email = ?';
      params.push(email);
    }
    
    const [rows] = await pool.query(query, params);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get order status
router.get('/:id/status', async (req, res, next) => {
  try {
    const { email } = req.query;
    let query = 'SELECT order_status, payment_status FROM orders WHERE id = ?';
    const params = [req.params.id];
    
    if (email) {
      query += ' AND user_id IN (SELECT id FROM users WHERE email = ?)';
      params.push(email);
    }
    
    const [rows] = await pool.query(query, params);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Calculate shipping cost
router.post('/shipping-calculate', async (req, res, next) => {
  try {
    const { address, weight } = req.body;
    // Mock shipping calculation - in production, integrate with shipping API
    const shippingCost = weight ? weight * 0.5 : 10;
    res.json({ success: true, data: { shipping_cost: shippingCost, estimated_days: '3-5' } });
  } catch (error) {
    next(error);
  }
});

// Apply discount code
router.post('/discount', async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;
    // Mock discount logic - in production, check against database
    let discount = 0;
    if (code === 'SAVE10') discount = cartTotal * 0.1;
    if (code === 'SAVE20') discount = cartTotal * 0.2;
    
    res.json({ success: true, data: { discount, new_total: cartTotal - discount } });
  } catch (error) {
    next(error);
  }
});

// Validate checkout data
router.post('/validate', async (req, res, next) => {
  try {
    const { email, shipping_address, payment_method } = req.body;
    // Mock validation - in production, implement proper validation
    const valid = email && shipping_address && payment_method;
    res.json({ success: true, data: { valid, errors: valid ? [] : ['Missing required fields'] } });
  } catch (error) {
    next(error);
  }
});

// Get order confirmation
router.get('/:id/confirmation', async (req, res, next) => {
  try {
    const { email } = req.query;
    let query = 'SELECT * FROM orders WHERE id = ?';
    const params = [req.params.id];
    
    if (email) {
      query += ' AND user_id IN (SELECT id FROM users WHERE email = ?)';
      params.push(email);
    }
    
    const [rows] = await pool.query(query, params);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Resend order confirmation
router.post('/:id/resend-confirmation', async (req, res, next) => {
  try {
    const { email } = req.body;
    // Mock email resend - in production, implement email service
    res.json({ success: true, data: { message: 'Confirmation email sent' } });
  } catch (error) {
    next(error);
  }
});

// Track order
router.get('/track/:trackingNumber', async (req, res, next) => {
  try {
    // Mock tracking - in production, integrate with shipping carrier API
    res.json({ success: true, data: { 
      tracking_number: req.params.trackingNumber,
      status: 'In Transit',
      estimated_delivery: '2024-01-15',
      location: 'Distribution Center'
    }});
  } catch (error) {
    next(error);
  }
});

// Get orders by user
router.get('/user/:userId', auth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.userId]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Create order
router.post('/', async (req, res, next) => {
  try {
    const { user_id, items, total_amount, shipping_address, payment_status, order_status } = req.body;
    const [result] = await pool.query(
      `INSERT INTO orders (user_id, items, total_amount, shipping_address, payment_status, order_status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, JSON.stringify(items), total_amount, JSON.stringify(shipping_address), payment_status, order_status]
    );
    const [newOrder] = await pool.query(
      `SELECT o.*, u.email as user_email 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?`,
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newOrder[0] });
  } catch (error) {
    next(error);
  }
});

// Update order status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { order_status, payment_status } = req.body;
    await pool.query(
      `UPDATE orders 
       SET order_status = ?, payment_status = ?
       WHERE id = ?`,
      [order_status, payment_status, req.params.id]
    );
    const [updated] = await pool.query(
      `SELECT o.*, u.email as user_email 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?`,
      [req.params.id]
    );
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Delete order
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
