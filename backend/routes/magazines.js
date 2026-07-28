import express from 'express';
import pool from '../config/database.js';
import { cache } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// Helper function to parse table of contents text to JSON
const parseTableOfContents = (tocText) => {
  if (!tocText) return [];
  
  try {
    // If it's already JSON, parse it
    if (tocText.trim().startsWith('[')) {
      return JSON.parse(tocText);
    }
    
    // Parse text format: "1.Title — Page 4"
    const items = tocText.split(/\d+\.|\d+\)/).filter(item => item.trim());
    const parsed = [];
    
    items.forEach(item => {
      const match = item.match(/(.+?)\s*—\s*Page\s*(\d+)/i);
      if (match) {
        parsed.push({
          title: match[1].trim(),
          page: parseInt(match[2])
        });
      }
    });
    
    return parsed;
  } catch (error) {
    console.error('Error parsing table of contents:', error);
    return [];
  }
};

// Helper function to fetch contributors by IDs
const fetchContributors = async (contributorIds) => {
  if (!contributorIds) return [];

  try {
    // Parse contributor IDs (could be comma-separated or single ID)
    const ids = contributorIds.toString().split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

    if (ids.length === 0) return [];

    const [contributors] = await pool.query(
      'SELECT id, name, role, avatar FROM contributors WHERE id IN (?) AND status = "active"',
      [ids]
    );

    return contributors.map(contributor => ({
      id: contributor.id,
      name: contributor.name,
      role: contributor.role || 'Contributor',
      avatar: contributor.avatar || '/images/default-avatar.png'
    }));
  } catch (error) {
    console.error('Error fetching contributors:', error);
    return [];
  }
};

// Cache for contributors to avoid repeated queries
const contributorsCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const fetchContributorsWithCache = async (contributorIds) => {
  if (!contributorIds) return [];

  const cacheKey = contributorIds.toString();
  const cached = contributorsCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const contributors = await fetchContributors(contributorIds);
  contributorsCache.set(cacheKey, { data: contributors, timestamp: Date.now() });
  return contributors;
};

// Get all magazines
router.get('/', cache(300), async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || null;
    const category = req.query.category || null;

    console.log('Magazines API called');

    let query = `SELECT id, slug, title, category_id, cover_image_url, pdf_url, preview_pages, published_date, description, created_at, updated_at, price, digital_price, print_price, subscription_price, pages, language, publisher, rating, review_count, table_of_contents, contributors, reviews, publish_date, issue FROM magazines`;
    const params = [];

    if (category) {
      query += ` WHERE category_id = ?`;
      params.push(category);
    }

    query += ` ORDER BY created_at DESC`;

    if (limit) {
      query += ` LIMIT ?`;
      params.push(limit);
    }

    console.log('Executing magazines query');
    console.log('Query:', query);
    console.log('Params:', params);
    const [rows] = await pool.query(query, params);
    console.log('Query returned successfully, rows:', rows.length);
    if (rows.length > 0) {
      console.log('Sample row data retrieved');
    }

    // Helper function to get image URL
    const getImageUrl = (url) => {
      if (!url || url === 'undefined') return '/music.jpeg';
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      if (url.startsWith('/uploads/')) {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
        return `${backendUrl}${url}`;
      }
      if (url.startsWith('/')) return url;
      if (!url.includes('/')) return `/${url}`;
      return url;
    };

    const transformed = rows.map(magazine => {
      const slug = magazine.slug || magazine.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || String(magazine.id);

      return {
        id: magazine.id,
        slug,
        title: magazine.title,
        category: magazine.category_id,
        coverImage: getImageUrl(magazine.cover_image_url),
        pdfUrl: getImageUrl(magazine.pdf_url),
        previewPages: magazine.preview_pages,
        published: magazine.published_date,
        description: magazine.description,
        createdAt: magazine.created_at,
        rating: 4.5, // Default rating
        reviewCount: 10 // Default review count
      };
    });

    res.json({ success: true, data: transformed });
  } catch (error) {
    console.error('Magazines GET / error:', error);
    next(error);
  }
});

// Search magazines
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    const [rows] = await pool.query(
      'SELECT id, slug, title, category_id, cover_image_url, pdf_url, preview_pages, published_date, description, created_at, updated_at, price, digital_price, print_price, subscription_price, pages, language, publisher, rating, review_count, table_of_contents, contributors, reviews, publish_date, issue FROM magazines WHERE title LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [`%${q}%`, limit, offset]
    );
    // Always return 200 with data array (empty if no results)
    res.json({ success: true, data: rows || [] });
  } catch (error) {
    next(error);
  }
});

// Get magazines by category
router.get('/category/:category', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    const [rows] = await pool.query(
      'SELECT id, slug, title, category_id, cover_image_url, pdf_url, preview_pages, published_date, description, created_at, updated_at, price, digital_price, print_price, subscription_price, pages, language, publisher, rating, review_count, table_of_contents, contributors, reviews, publish_date, issue FROM magazines WHERE category_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [req.params.category, limit, offset]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Get featured magazines
router.get('/featured', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const [rows] = await pool.query(
      'SELECT id, slug, title, category_id, cover_image_url, pdf_url, preview_pages, published_date, description, created_at, updated_at, price, digital_price, print_price, subscription_price, pages, language, publisher, rating, review_count, table_of_contents, contributors, reviews, publish_date, issue FROM magazines ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Get magazine by slug or ID
router.get('/:slug', async (req, res, next) => {
  try {
    const param = req.params.slug;
    const isNumeric = /^\d+$/.test(param);
    
    let rows;
    
    if (isNumeric) {
      [rows] = await pool.query('SELECT id, slug, title, category_id, cover_image_url, pdf_url, preview_pages, published_date, description, created_at, updated_at, price, digital_price, print_price, subscription_price, pages, language, publisher, rating, review_count, table_of_contents, contributors, reviews, publish_date, issue FROM magazines WHERE id = ?', [param]);
    } else {
      // Try to find by matching slug against generated title slugs
      const [allMagazines] = await pool.query('SELECT id, slug, title, category_id, cover_image_url, pdf_url, preview_pages, published_date, description, created_at, updated_at, price, digital_price, print_price, subscription_price, pages, language, publisher, rating, review_count, table_of_contents, contributors, reviews, publish_date, issue FROM magazines');
      rows = allMagazines.filter(mag => {
        const generatedSlug = mag.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || String(mag.id);
        return generatedSlug === param;
      });
    }
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Magazine not found' });
    }

    // Map categories to actual image files in frontend public folder
    const categoryImageMap = {
      32: '/blockchain.jpeg', // Technology
      42: '/music.jpeg', // Music
      43: '/fashionandbusiness.jpeg', // Fashion
      45: '/blockchain.jpeg', // Technology
      46: '/community.jpeg', // Travel/Community
      47: '/womeninbusiness.jpeg', // Lifestyle
      48: '/financeandinvestment.jpeg', // Finance
      49: '/boxing.jpeg', // Sports
      50: '/photography.jpeg', // Art
      51: '/barandrestaurant.jpeg', // Food
      52: '/kids.jpeg', // Health
      53: '/automotives.jpeg' // Automotive
    };

    // Helper function to get image URL (handle Cloudinary and CMS uploads)
    const getImageUrl = (url, categoryId, fallbackUrl = null) => {
      const cmsUrl = process.env.CMS_URL || 'https://trendorabay-content-management-system.onrender.com';
      
      if (!url || url === 'undefined' || url === '/uploads/stories/undefined') {
        // If no URL provided, try fallback URL first, then category-based image
        if (fallbackUrl && fallbackUrl.startsWith('/uploads/')) {
          return `${cmsUrl}${fallbackUrl}`;
        }
        return categoryImageMap[categoryId] || '/music.jpeg';
      }
      
      // Return full URLs as-is (Cloudinary, external images)
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      
      // If it's a relative path starting with /uploads, try backend URL first, fall back to category image
      if (url.startsWith('/uploads/')) {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
        return `${backendUrl}${url}`;
      }
      // If it starts with / but not /uploads, check if it's a fallback and use preview_pages if available
      if (url.startsWith('/') && !url.startsWith('/uploads/')) {
        // If this looks like a fallback image and we have a preview_pages URL, use that instead
        if (fallbackUrl && fallbackUrl.startsWith('/uploads/')) {
          return categoryImageMap[categoryId] || '/music.jpeg';
        }
        return url;
      }
      // If it's just a filename, it's in the frontend public folder
      if (!url.includes('/')) {
        return `/${url}`;
      }
      // If it has a path, return as-is
      return url;
    };

    const magazineContributorIds = rows[0].contributors
      ? rows[0].contributors.toString().split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
      : [];

    let magazineContributors = [];
    if (magazineContributorIds.length > 0) {
      const [contributors] = await pool.query(
        'SELECT id, name, role, avatar FROM contributors WHERE id IN (?) AND status = "active"',
        [magazineContributorIds]
      );
      magazineContributors = contributors.map(contributor => ({
        id: contributor.id,
        name: contributor.name,
        role: contributor.role || 'Contributor',
        avatar: contributor.avatar || '/images/default-avatar.png'
      }));
    }

    // Generate slug from title if not exists
    const slug = rows[0].slug || rows[0].title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || String(rows[0].id);

    const transformed = {
      ...rows[0],
      slug,
      coverImage: getImageUrl(rows[0].cover_image || rows[0].cover_image_url, rows[0].category_id || rows[0].category, rows[0].preview_pages),
      pdfUrl: getImageUrl(rows[0].pdf_url, rows[0].category_id || rows[0].category),
      price: rows[0].price || 9.99,
      digitalPrice: rows[0].digital_price || 9.99,
      printPrice: rows[0].print_price || 13.99,
      subscriptionPrice: rows[0].subscription_price || 99.99,
      pages: rows[0].pages || 100,
      language: rows[0].language || 'English',
      publisher: rows[0].publisher || 'Trendorabay',
      rating: rows[0].rating || 4.5,
      reviewCount: rows[0].review_count || 0,
      tableOfContents: parseTableOfContents(rows[0].table_of_contents),
      contributors: magazineContributors,
      reviews: rows[0].reviews,
      publishDate: rows[0].publish_date || rows[0].created_at,
      description: rows[0].description
    };

    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Get magazine categories
router.get('/categories', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT category FROM magazines WHERE category IS NOT NULL ORDER BY category'
    );
    const categories = rows.map(row => row.category);
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

// Get subscription options
router.get('/subscriptions', async (req, res, next) => {
  try {
    // Mock subscription data - in production, this would come from a subscriptions table
    const subscriptions = [
      { id: 1, name: 'Digital Monthly', price: 9.99, duration: 'monthly' },
      { id: 2, name: 'Digital Yearly', price: 99.99, duration: 'yearly' },
      { id: 3, name: 'Print + Digital Yearly', price: 149.99, duration: 'yearly' }
    ];
    res.json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
});

// Create subscription
router.post('/subscriptions', async (req, res, next) => {
  try {
    const { email, planId, ...subscriptionData } = req.body;
    // In production, this would create a subscription record and process payment
    res.status(201).json({ 
      success: true, 
      data: { 
        id: Date.now(), 
        email, 
        planId, 
        status: 'active',
        ...subscriptionData 
      } 
    });
  } catch (error) {
    next(error);
  }
});

// Create magazine
router.post('/', async (req, res, next) => {
  try {
    const { title, cover_image_url, category_id, issue, pdf_url, cover_image, category } = req.body;
    const [result] = await pool.query(
      `INSERT INTO magazines (title, cover_image_url, category_id, issue, pdf_url) 
       VALUES (?, ?, ?, ?, ?)`,
      [title, cover_image_url || cover_image, category_id || category, issue, pdf_url]
    );
    const [newMagazine] = await pool.query(
      'SELECT id, slug, title, category_id, cover_image_url, pdf_url, preview_pages, published_date, description, created_at, updated_at, price, digital_price, print_price, subscription_price, pages, language, publisher, rating, review_count, table_of_contents, contributors, reviews, publish_date, issue FROM magazines WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newMagazine[0] });
  } catch (error) {
    next(error);
  }
});

// Update magazine
router.put('/:id', async (req, res, next) => {
  try {
    const { title, cover_image_url, category_id, issue, pdf_url, cover_image, category } = req.body;
    await pool.query(
      `UPDATE magazines 
       SET title = ?, cover_image_url = ?, category_id = ?, issue = ?, pdf_url = ?
       WHERE id = ?`,
      [title, cover_image_url || cover_image, category_id || category, issue, pdf_url, req.params.id]
    );
    const [updated] = await pool.query(
      'SELECT id, slug, title, category_id, cover_image_url, pdf_url, preview_pages, published_date, description, created_at, updated_at, price, digital_price, print_price, subscription_price, pages, language, publisher, rating, review_count, table_of_contents, contributors, reviews, publish_date, issue FROM magazines WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Delete magazine
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM magazines WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Magazine deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
