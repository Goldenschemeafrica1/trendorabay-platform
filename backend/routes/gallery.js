import express from 'express';
import pool from '../config/database.js';
import { cache } from '../middleware/cacheMiddleware.js';
import auth from '../middleware/auth.js';
import { getTableStatus } from '../config/tableValidator.js';

const router = express.Router();

// Get all gallery images
router.get('/', cache(300), async (req, res, next) => {
  try {
    const { category, featured, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    console.log('Gallery API called');

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM gallery WHERE 1=1';
    const countParams = [];

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    if (featured) {
      countQuery += ' AND featured = 1';
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    console.log('Gallery pagination calculated');

    let query = `
      SELECT * FROM gallery
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (featured) {
      query += ' AND featured = 1';
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    console.log('Executing gallery query');

    const [rows] = await pool.query(query, params);

    console.log('Gallery items fetched successfully');

    res.json({
      data: rows,
      totalPages: totalPages,
      total: total
    });
  } catch (error) {
    next(error);
  }
});

// Get gallery item by ID
router.get('/:id', cache(300), async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM gallery WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Gallery item not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Create gallery item (admin only)
router.post('/', auth, async (req, res, next) => {
  try {
    const { title, image_url, caption, category, featured } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO gallery (title, image_url, caption, category, featured) 
       VALUES (?, ?, ?, ?, ?)`,
      [title, image_url, caption, category, featured ? 1 : 0]
    );
    
    const [newItem] = await pool.query(
      'SELECT * FROM gallery WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({ success: true, data: newItem[0] });
  } catch (error) {
    next(error);
  }
});

// Update gallery item (admin only)
router.put('/:id', auth, async (req, res, next) => {
  try {
    const { title, image_url, caption, category, featured } = req.body;
    
    await pool.query(
      `UPDATE gallery 
       SET title = ?, image_url = ?, caption = ?, category = ?, featured = ?
       WHERE id = ?`,
      [title, image_url, caption, category, featured ? 1 : 0, req.params.id]
    );
    
    const [updated] = await pool.query(
      'SELECT * FROM gallery WHERE id = ?',
      [req.params.id]
    );
    
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Delete gallery item (admin only)
router.delete('/:id', auth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Like a gallery item
router.post('/:id/like', auth, async (req, res, next) => {
  try {
    const user_id = req.userId;
    const gallery_id = req.params.id;

    // Check if already liked
    const [existing] = await pool.query(
      'SELECT * FROM gallery_likes WHERE user_id = ? AND gallery_id = ?',
      [user_id, gallery_id]
    );

    if (existing.length > 0) {
      // Unlike
      await pool.query(
        'DELETE FROM gallery_likes WHERE user_id = ? AND gallery_id = ?',
        [user_id, gallery_id]
      );
      await pool.query(
        'UPDATE gallery SET likes_count = likes_count - 1 WHERE id = ?',
        [gallery_id]
      );
      const [likes] = await pool.query(
        'SELECT likes_count FROM gallery WHERE id = ?',
        [gallery_id]
      );
      return res.json({ success: true, liked: false, likes: likes[0].likes_count });
    } else {
      // Like
      await pool.query(
        'INSERT INTO gallery_likes (user_id, gallery_id) VALUES (?, ?)',
        [user_id, gallery_id]
      );
      await pool.query(
        'UPDATE gallery SET likes_count = likes_count + 1 WHERE id = ?',
        [gallery_id]
      );
      const [likes] = await pool.query(
        'SELECT likes_count FROM gallery WHERE id = ?',
        [gallery_id]
      );
      return res.json({ success: true, liked: true, likes: likes[0].likes_count });
    }
  } catch (error) {
    next(error);
  }
});

// Get likes count for a gallery item
router.get('/:id/likes', async (req, res, next) => {
  try {
    // Use cached table existence check
    if (!getTableStatus('gallery_likes')) {
      return res.json({ success: true, likes: 0 });
    }

    const [likes] = await pool.query(
      'SELECT COUNT(*) as count FROM gallery_likes WHERE gallery_id = ?',
      [req.params.id]
    );
    res.json({ success: true, likes: likes[0].count });
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.json({ success: true, likes: 0 });
  }
});

// Create gallery likes table
router.post('/create-likes-table', async (req, res, next) => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS gallery_likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        gallery_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_gallery (user_id, gallery_id),
        INDEX idx_user_id (user_id),
        INDEX idx_gallery_id (gallery_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await pool.query(createTableQuery);
    res.json({ success: true, message: 'Gallery likes table created successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
