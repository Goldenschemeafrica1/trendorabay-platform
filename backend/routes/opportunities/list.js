import express from 'express';
import pool from '../../config/database.js';
import { cache } from '../../middleware/cacheMiddleware.js';
import { getImageUrl } from '../../utils/imageHelpers.js';

const router = express.Router();

// Get all opportunities
router.get('/', cache(300), async (req, res, next) => {
  try {
    const { status, featured, category, country, opportunity_type, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // OPTIMIZATION: Only select necessary fields for list views
    let query = 'SELECT id, title, slug, short_description, category, organization_name, organization_logo, opportunity_type, status, featured, image_url, country, location, deadline, created_at FROM opportunities WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (featured === 'true' || featured === true) {
      query += ' AND featured = 1';
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (country) {
      query += ' AND country = ?';
      params.push(country);
    }

    if (opportunity_type) {
      query += ' AND opportunity_type = ?';
      params.push(opportunity_type);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);

    // Transform image URLs to serve CMS uploads
    const transformed = rows.map(opportunity => ({
      ...opportunity,
      image_url: getImageUrl(opportunity.image_url),
      organization_logo: getImageUrl(opportunity.organization_logo)
    }));

    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Get opportunity by ID or slug
router.get('/:identifier', async (req, res, next) => {
  try {
    const identifier = req.params.identifier;
    const isNumeric = /^\d+$/.test(identifier);
    
    let query, params;
    if (isNumeric) {
      query = 'SELECT * FROM opportunities WHERE id = ?';
      params = [identifier];
    } else {
      query = 'SELECT * FROM opportunities WHERE slug = ?';
      params = [identifier];
    }
    
    const [rows] = await pool.query(query, params);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Opportunity not found' });
    }
    
    // Transform image URLs to serve CMS uploads
    const transformed = {
      ...rows[0],
      image_url: getImageUrl(rows[0].image_url),
      organization_logo: getImageUrl(rows[0].organization_logo)
    };
    
    // Increment views count
    await pool.query('UPDATE opportunities SET views = views + 1 WHERE id = ?', [rows[0].id]);
    
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

export default router;
