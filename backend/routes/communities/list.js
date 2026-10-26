import express from 'express';
import pool from '../../config/database.js';
import { cache } from '../../middleware/cacheMiddleware.js';
import { getImageUrl } from '../../utils/imageHelpers.js';

const router = express.Router();

// Get all communities
router.get('/', cache(300), async (req, res, next) => {
  try {
    const { category, status, page = 1, limit = 1000 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM communities WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);

    // Transform image URLs to serve CMS uploads
    const transformed = rows.map(community => ({
      ...community,
      cover_image_url: getImageUrl(community.cover_image_url, community.category),
      icon_url: getImageUrl(community.icon_url, community.category)
    }));

    res.json({ success: true, data: transformed });
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
      return res.status(503).json({
        success: false,
        error: 'Service Unavailable',
        details: 'Database connection failed. Please try again later.'
      });
    }
    next(error);
  }
});

// Get community by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM communities WHERE slug = ?',
      [req.params.slug]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Community not found' });
    }
    // Transform image URLs to serve CMS uploads
    const transformed = {
      ...rows[0],
      cover_image_url: getImageUrl(rows[0].cover_image_url, rows[0].category),
      icon_url: getImageUrl(rows[0].icon_url, rows[0].category)
    };
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Get community by ID
router.get('/id/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM communities WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Community not found' });
    }
    // Transform image URLs to serve CMS uploads
    const transformed = {
      ...rows[0],
      cover_image_url: getImageUrl(rows[0].cover_image_url, rows[0].category),
      icon_url: getImageUrl(rows[0].icon_url, rows[0].category)
    };
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Get user's communities
router.get('/user/:userId', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.name, c.slug, c.category, c.description, c.cover_image_url, c.icon_url, c.member_count
       FROM community_members cm
       JOIN communities c ON cm.community_id = c.id
       WHERE cm.user_id = ? AND cm.status = 'active'
       ORDER BY cm.joined_at DESC`,
      [req.params.userId]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

export default router;
