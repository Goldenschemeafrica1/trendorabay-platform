import express from 'express';
import pool from '../../config/database.js';
import { cache } from '../../middleware/cacheMiddleware.js';

const router = express.Router();

// Helper function to get image URL
const getImageUrl = (url) => {
  if (!url || url === 'undefined') return '/music.jpeg';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:10000';
    return `${backendUrl}${url}`;
  }
  if (url.startsWith('/')) return url;
  if (!url.includes('/')) return `/${url}`;
  return url;
};

// Get all magazines
router.get('/', cache(600), async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || null;
    const category = req.query.category || null;

    let query = `SELECT id, slug, title, category_id, cover_image_url, pdf_url, preview_pages, published_date, description, created_at, updated_at, price, digital_price, print_price, subscription_price, pages, language, publisher, rating, review_count, table_of_contents, contributors, reviews, publish_date, issue FROM magazines`;
    const params = [];

    if (category) {
      query += ` WHERE category_id = ?`;
      params.push(category);
    }

    query += ` ORDER BY id DESC`;

    if (limit) {
      query += ` LIMIT ?`;
      params.push(limit);
    }

    const [rows] = await pool.query(query, params);

    const transformed = rows.map(magazine => {
      const slug = magazine.slug || magazine.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || String(magazine.id);

      return {
        id: magazine.id,
        slug,
        title: magazine.title,
        category: magazine.category_id,
        coverImage: getImageUrl(magazine.cover_image_url),
        coverImageLarge: getImageUrl(magazine.cover_image_url),
        pdfUrl: getImageUrl(magazine.pdf_url),
        previewPages: magazine.preview_pages,
        published: magazine.published_date,
        description: magazine.description,
        createdAt: magazine.created_at,
        fullDescription: magazine.description || 'Explore this exciting magazine issue featuring the latest stories and insights.',
        reviewCount: magazine.review_count || 0,
        rating: magazine.rating || 4.5,
        readers: magazine.readers || 1000,
        isNew: magazine.is_new || false,
        isFeatured: magazine.is_featured || false,
        editorPick: magazine.editor_pick || false,
        subcategory: magazine.subcategory || magazine.category || 'General',
        issue: magazine.issue || 'Vol. 1 / 2026',
        price: magazine.price || 9.99,
        digitalPrice: magazine.digital_price || 9.99,
        printPrice: magazine.print_price || 13.99,
        subscriptionPrice: magazine.subscription_price || 99.99,
        pages: magazine.pages || 100,
        language: magazine.language || 'English',
        publisher: magazine.publisher || 'Trendorabay',
        editor: magazine.editor || 'Trendorabay Editorial',
        contributors: [],
        tableOfContents: [],
        reviews: [],
        relatedMagazines: [],
      };
    });

    res.json({ success: true, data: transformed });
  } catch (error) {
    console.error('Magazines GET / error:', error);
    next(error);
  }
});

// Get magazine by slug (more specific route first)
router.get('/slug/:slug', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM magazines WHERE slug = ?',
      [req.params.slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Magazine not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get magazine by ID
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM magazines WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Magazine not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
