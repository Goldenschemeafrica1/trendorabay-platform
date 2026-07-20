import express from 'express';
import pool from '../config/database.js';
import { cache } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// Helper function to get image URL (handle Cloudinary and CMS uploads)
const getImageUrl = (url) => {
  if (!url || url === 'undefined' || url === '/uploads/stories/undefined') return '/images/product-placeholder.jpg';
  
  // Return full URLs as-is (Cloudinary, external images)
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  
  // For relative paths, construct full URL using CMS base
  const cmsUrl = process.env.CMS_URL || 'https://trendorabay-content-management-system.onrender.com';
  
  // If it's a relative path starting with /uploads, serve from CMS
  if (url.startsWith('/uploads/')) {
    return `${cmsUrl}${url}`;
  }
  // If it starts with /, it's in the frontend public folder - return as-is
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

// Get all merchandise
router.get('/', cache(300), async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    console.log('Products query:', query);
    console.log('Products params:', params);
    
    const [rows] = await pool.query(query, params);
    console.log('Products fetched:', rows.length);
    console.log('First product:', rows[0]);
    
    // Transform image URLs to serve CMS uploads
    const transformed = rows.map(product => ({
      ...product,
      image_url: getImageUrl(product.image_url)
    }));
    
    res.json({ success: true, data: transformed });
  } catch (error) {
    console.error('Error fetching products:', error);
    next(error);
  }
});

// Get merchandise by ID
router.get('/:id', cache(300), async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Merchandise not found' });
    }
    // Transform image URL to serve CMS uploads
    const transformed = {
      ...rows[0],
      image_url: getImageUrl(rows[0].image_url)
    };
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Get merchandise by category
router.get('/category/:category', cache(300), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE category = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [req.params.category, limit, offset]
    );
    // Transform image URLs to serve CMS uploads
    const transformed = rows.map(product => ({
      ...product,
      image_url: getImageUrl(product.image_url)
    }));
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Get featured products
router.get('/featured', cache(300), async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const [rows] = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    // Transform image URLs to serve CMS uploads
    const transformed = rows.map(product => ({
      ...product,
      image_url: getImageUrl(product.image_url)
    }));
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Search products
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE (name LIKE ? OR description LIKE ?) AND status = "active" ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [`%${q}%`, `%${q}%`, limit, offset]
    );
    // Transform image URLs to serve CMS uploads
    const transformed = rows.map(product => ({
      ...product,
      image_url: getImageUrl(product.image_url)
    }));
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Get product categories
router.get('/categories', cache(600), async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category'
    );
    const categories = rows.map(row => row.category);
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

// Get product options
router.get('/:id/options', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT sizes, stock FROM products WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    const product = rows[0];
    const sizes = product.sizes ? product.sizes.split(',') : [];
    res.json({ success: true, data: { sizes, colors: ['Black', 'White', 'Navy'] } });
  } catch (error) {
    next(error);
  }
});

// Check product availability
router.get('/:id/availability', async (req, res, next) => {
  try {
    const { size, color } = req.query;
    const [rows] = await pool.query(
      'SELECT stock FROM products WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    const product = rows[0];
    const available = product.stock > 0;
    res.json({ success: true, data: { available, stock: product.stock } });
  } catch (error) {
    next(error);
  }
});

// Get related products
router.get('/:id/related', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const [product] = await pool.query(
      'SELECT category FROM products WHERE id = ?',
      [req.params.id]
    );
    if (product.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE category = ? AND id != ? ORDER BY created_at DESC LIMIT ?',
      [product[0].category, req.params.id, limit]
    );
    // Transform image URLs to serve CMS uploads
    const transformed = rows.map(product => ({
      ...product,
      image_url: getImageUrl(product.image_url)
    }));
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Create merchandise
router.post('/', async (req, res, next) => {
  try {
    const { name, description, price, image_url, category, stock, sizes } = req.body;
    const [result] = await pool.query(
      `INSERT INTO products (name, description, price, image_url, category, stock, sizes) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description, price, image_url, category, stock, sizes]
    );
    const [newMerch] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newMerch[0] });
  } catch (error) {
    next(error);
  }
});

// Update merchandise
router.put('/:id', async (req, res, next) => {
  try {
    const { name, description, price, image_url, category, stock, sizes } = req.body;
    await pool.query(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, image_url = ?, category = ?, stock = ?, sizes = ?
       WHERE id = ?`,
      [name, description, price, image_url, category, stock, sizes, req.params.id]
    );
    const [updated] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Delete merchandise
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Merchandise deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
