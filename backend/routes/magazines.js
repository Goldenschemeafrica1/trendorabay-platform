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
    const [rows] = await pool.query(`
      SELECT * FROM magazines
      ORDER BY created_at DESC
    `);

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

    // Helper function to get image URL - serve exact database URLs
    const getImageUrl = (url, categoryId, fallbackUrl = null) => {
      if (!url) {
        // If no URL provided, try fallback URL first, then category-based image
        if (fallbackUrl && fallbackUrl.startsWith('/uploads/')) {
          return `http://localhost:3001${fallbackUrl}`;
        }
        return categoryImageMap[categoryId] || '/music.jpeg';
      }
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      // If it's a relative path starting with /uploads, serve from backend
      if (url.startsWith('/uploads/')) {
        return `http://localhost:3001${url}`;
      }
      // If it starts with / but not /uploads, check if it's a fallback and use preview_pages if available
      if (url.startsWith('/') && !url.startsWith('/uploads/')) {
        // If this looks like a fallback image and we have a preview_pages URL, use that instead
        if (fallbackUrl && fallbackUrl.startsWith('/uploads/')) {
          return `http://localhost:3001${fallbackUrl}`;
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

    // Fetch all unique contributor IDs at once
    const allContributorIds = new Set();
    rows.forEach(magazine => {
      if (magazine.contributors) {
        magazine.contributors.toString().split(',').forEach(id => {
          const numId = parseInt(id.trim());
          if (!isNaN(numId)) allContributorIds.add(numId);
        });
      }
    });

    // Batch fetch all contributors
    let allContributors = [];
    if (allContributorIds.size > 0) {
      const [contributors] = await pool.query(
        'SELECT id, name, role, avatar FROM contributors WHERE id IN (?) AND status = "active"',
        [Array.from(allContributorIds)]
      );
      allContributors = contributors;
    }

    // Create a map for quick lookup
    const contributorMap = new Map();
    allContributors.forEach(contributor => {
      contributorMap.set(contributor.id, {
        id: contributor.id,
        name: contributor.name,
        role: contributor.role || 'Contributor',
        avatar: contributor.avatar || '/images/default-avatar.png'
      });
    });

    const transformed = rows.map(magazine => {
      const magazineContributorIds = magazine.contributors
        ? magazine.contributors.toString().split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
        : [];

      const magazineContributors = magazineContributorIds
        .map(id => contributorMap.get(id))
        .filter(c => c !== undefined);

      return {
        ...magazine,
        coverImage: getImageUrl(magazine.cover_image_url, magazine.category_id, magazine.preview_pages),
        pdfUrl: getImageUrl(magazine.pdf_url, magazine.category_id),
        price: magazine.price,
        digitalPrice: magazine.digital_price,
        printPrice: magazine.print_price,
        subscriptionPrice: magazine.subscription_price,
        pages: magazine.pages,
        language: magazine.language,
        publisher: magazine.publisher,
        rating: magazine.rating,
        reviewCount: magazine.review_count,
        tableOfContents: parseTableOfContents(magazine.table_of_contents),
        contributors: magazineContributors,
        reviews: magazine.reviews,
        publishDate: magazine.published_date,
        description: magazine.description
      };
    });

    res.json({ success: true, data: transformed });
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

    // Helper function to get image URL (serve CMS uploads)
    const getImageUrl = (url, categoryId, fallbackUrl = null) => {
      if (!url) {
        // If no URL provided, try fallback URL first, then category-based image
        if (fallbackUrl && fallbackUrl.startsWith('/uploads/')) {
          return `http://localhost:3001${fallbackUrl}`;
        }
        return categoryImageMap[categoryId] || '/music.jpeg';
      }
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      // If it's a relative path starting with /uploads, serve from backend
      if (url.startsWith('/uploads/')) {
        return `http://localhost:3001${url}`;
      }
      // If it starts with / but not /uploads, check if it's a fallback and use preview_pages if available
      if (url.startsWith('/') && !url.startsWith('/uploads/')) {
        // If this looks like a fallback image and we have a preview_pages URL, use that instead
        if (fallbackUrl && fallbackUrl.startsWith('/uploads/')) {
          return `http://localhost:3001${fallbackUrl}`;
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

    const transformed = {
      ...rows[0],
      coverImage: getImageUrl(rows[0].cover_image_url, rows[0].category_id, rows[0].preview_pages),
      pdfUrl: getImageUrl(rows[0].pdf_url, rows[0].category_id),
      price: rows[0].price,
      digitalPrice: rows[0].digital_price,
      printPrice: rows[0].print_price,
      subscriptionPrice: rows[0].subscription_price,
      pages: rows[0].pages,
      language: rows[0].language,
      publisher: rows[0].publisher,
      rating: rows[0].rating,
      reviewCount: rows[0].review_count,
      tableOfContents: parseTableOfContents(rows[0].table_of_contents),
      contributors: magazineContributors,
      reviews: rows[0].reviews,
      publishDate: rows[0].published_date,
      description: rows[0].description
    };

    res.json({ success: true, data: transformed });
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
      'SELECT * FROM magazines WHERE category_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
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
      'SELECT * FROM magazines ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
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
      'SELECT * FROM magazines WHERE title LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [`%${q}%`, limit, offset]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Get magazine categories
router.get('/categories', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT category_id FROM magazines WHERE category_id IS NOT NULL ORDER BY category_id'
    );
    const categories = rows.map(row => row.category_id);
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
    const { title, cover_image_url, category_id, issue, pdf_url } = req.body;
    const [result] = await pool.query(
      `INSERT INTO magazines (title, cover_image_url, category_id, issue, pdf_url) 
       VALUES (?, ?, ?, ?, ?)`,
      [title, cover_image_url, category_id, issue, pdf_url]
    );
    const [newMagazine] = await pool.query(
      'SELECT * FROM magazines WHERE id = ?',
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
    const { title, cover_image_url, category_id, issue, pdf_url } = req.body;
    await pool.query(
      `UPDATE magazines 
       SET title = ?, cover_image_url = ?, category_id = ?, issue = ?, pdf_url = ?
       WHERE id = ?`,
      [title, cover_image_url, category_id, issue, pdf_url, req.params.id]
    );
    const [updated] = await pool.query(
      'SELECT * FROM magazines WHERE id = ?',
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
