import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Helper function to get image URL - serve CMS uploads
const getImageUrl = (url) => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // If it's a relative path starting with /uploads, serve from backend
  if (url.startsWith('/uploads/')) {
    const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || `http://localhost:${process.env.PORT || 3001}`;
    return `${baseUrl}${url}`;
  }
  // If it starts with / but not /uploads, return as-is
  if (url.startsWith('/')) {
    return url;
  }
  // If it's just a filename, it's in the frontend public folder
  if (!url.includes('/')) {
    return `/${url}`;
  }
  // If it has a path, return as-is
  return url;
};

// Get all advertisements
router.get('/', async (req, res, next) => {
  try {
    const { position, status } = req.query;
    
    let query = `
      SELECT * FROM advertisements 
      WHERE 1=1
    `;
    const params = [];
    
    if (position) {
      query += ' AND position = ?';
      params.push(position);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await pool.query(query, params);
    const transformed = rows.map(ad => ({
      ...ad,
      image_url: getImageUrl(ad.image_url),
      mobile_image_url: ad.mobile_image_url ? getImageUrl(ad.mobile_image_url) : null
    }));
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Get advertisement by ID
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM advertisements WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Advertisement not found' });
    }
    const transformed = {
      ...rows[0],
      image_url: getImageUrl(rows[0].image_url),
      mobile_image_url: rows[0].mobile_image_url ? getImageUrl(rows[0].mobile_image_url) : null
    };
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Create advertisement
router.post('/', async (req, res, next) => {
  try {
    const { title, image_url, link_url, position, status } = req.body;
    const [result] = await pool.query(
      `INSERT INTO advertisements (title, image_url, link_url, position, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [title, image_url, link_url, position, status || 'active']
    );
    const [newAd] = await pool.query(
      'SELECT * FROM advertisements WHERE id = ?',
      [result.insertId]
    );
    const transformed = {
      ...newAd[0],
      image_url: getImageUrl(newAd[0].image_url),
      mobile_image_url: newAd[0].mobile_image_url ? getImageUrl(newAd[0].mobile_image_url) : null
    };
    res.status(201).json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Update advertisement
router.put('/:id', async (req, res, next) => {
  try {
    const { title, image_url, link_url, position, status } = req.body;
    await pool.query(
      `UPDATE advertisements 
       SET title = ?, image_url = ?, link_url = ?, position = ?, status = ?
       WHERE id = ?`,
      [title, image_url, link_url, position, status, req.params.id]
    );
    const [updated] = await pool.query(
      'SELECT * FROM advertisements WHERE id = ?',
      [req.params.id]
    );
    const transformed = {
      ...updated[0],
      image_url: getImageUrl(updated[0].image_url),
      mobile_image_url: updated[0].mobile_image_url ? getImageUrl(updated[0].mobile_image_url) : null
    };
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Delete advertisement
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM advertisements WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, message: 'Advertisement deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
