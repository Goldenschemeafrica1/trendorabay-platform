import express from 'express';
import pool from '../config/database.js';
import { cache } from '../middleware/cacheMiddleware.js';
import { cachePatterns } from '../middleware/cacheMiddleware.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all stories
router.get('/', cache(300), async (req, res, next) => {
  try {
    const { category, author, search, page = 1, limit = 12, featured, status } = req.query;
    const offset = (page - 1) * limit;

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM stories s WHERE 1=1';
    const countParams = [];

    if (category) {
      countQuery += ' AND s.category_id = ?';
      countParams.push(category);
    }
    if (author) {
      countQuery += ' AND s.author_id = ?';
      countParams.push(author);
    }
    if (search) {
      countQuery += ' AND (s.title LIKE ? OR s.content LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (featured) {
      countQuery += ' AND s.featured = 1';
    }
    if (status) {
      countQuery += ' AND s.status = ?';
      countParams.push(status);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    let query = `
      SELECT s.*, a.name as author_name, a.avatar_url as author_avatar, c.name as category_name
      FROM stories s
      LEFT JOIN authors a ON s.author_id = a.id
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND s.category_id = ?';
      params.push(category);
    }
    if (author) {
      query += ' AND s.author_id = ?';
      params.push(author);
    }
    if (search) {
      query += ' AND (s.title LIKE ? OR s.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (featured) {
      query += ' AND s.featured = 1';
    }
    if (status) {
      query += ' AND s.status = ?';
      params.push(status);
    }

    query += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);

    // Log actual image URLs from database for debugging
    console.log('Sample image URLs from database:', rows.slice(0, 3).map(r => ({ id: r.id, featured_image_url: r.featured_image_url })));

    // Map categories to actual image files in frontend public folder
    const categoryImageMap = {
      'Music': '/music.jpeg',
      'Fashion': '/fashionandbusiness.jpeg',
      'Business': '/financeandinvestment.jpeg',
      'Technology': '/blockchain.jpeg',
      'Travel': '/community.jpeg',
      'Lifestyle': '/womeninbusiness.jpeg',
      'Finance': '/financeandinvestment.jpeg',
      'Sports': '/boxing.jpeg',
      'Art': '/photography.jpeg',
      'Food': '/barandrestaurant.jpeg',
      'Health': '/kids.jpeg',
      'Automotive': '/automotives.jpeg'
    };

    // Helper function to get image URL (handle Cloudinary and CMS uploads)
    const getImageUrl = (url, category) => {
      if (!url || url === 'undefined' || url === '/uploads/stories/undefined') return categoryImageMap[category] || '/music.jpeg';
      
      // Return full URLs as-is (Cloudinary, external images)
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      
      // If it's a relative path starting with /uploads, try backend URL first, fall back to category image
      if (url.startsWith('/uploads/')) {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
        return `${backendUrl}${url}`;
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

    // Helper function to get avatar URL (serve CMS uploads)
    const getAvatarUrl = (url) => {
      if (!url) return '/logo.jpeg';
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      // If it's a relative path starting with /uploads, fall back to logo since CMS files don't exist
      if (url.startsWith('/uploads/')) {
        return '/logo.jpeg';
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

    // Transform data to match frontend expectations
    const transformedStories = rows.map(story => {
      // Generate slug from title if not exists - trim whitespace first
      const cleanTitle = story.title?.trim() || '';
      const slug = story.slug || cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || String(story.id);
      
      return {
        id: story.id,
        slug,
        title: story.title,
        content: story.content,
        imageUrl: getImageUrl(story.featured_image_url, story.category_name),
        categoryName: story.category_name,
        category: story.category_name,
        featured: story.featured === 1,
        author: story.author_id ? {
          id: story.author_id,
          name: story.author_name || 'Unknown Author',
          avatar: getAvatarUrl(story.author_avatar)
        } : null,
        publishedDate: story.published_at || story.created_at,
        createdAt: story.created_at,
        updatedAt: story.updated_at,
        status: story.status,
        author_name: story.author_name,
        author_id: story.author_id
      };
    });

    res.json({
      data: transformedStories,
      totalPages: totalPages,
      total: total
    });
  } catch (error) {
    next(error);
  }
});

// Get story by slug or ID
router.get('/:slug', cache(300), async (req, res, next) => {
  try {
    const param = req.params.slug;
    const isNumeric = /^\d+$/.test(param);
    
    let rows;
    
    if (isNumeric) {
      [rows] = await pool.query(
        `SELECT s.*, a.name as author_name, a.avatar_url as author_avatar, a.bio as author_bio
         FROM stories s
         LEFT JOIN authors a ON s.author_id = a.id
         WHERE s.id = ?`,
        [param]
      );
    } else {
      // Try to find by matching slug against generated title slugs
      const [allStories] = await pool.query(
        `SELECT s.*, a.name as author_name, a.avatar_url as author_avatar, a.bio as author_bio
         FROM stories s
         LEFT JOIN authors a ON s.author_id = a.id`
      );
      rows = allStories.filter(story => {
        const cleanTitle = story.title?.trim() || '';
        const generatedSlug = story.slug || cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || String(story.id);
        return generatedSlug === param;
      });
    }
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Story not found' });
    }

    // Helper function to get avatar URL (serve CMS uploads)
    const getAvatarUrl = (url) => {
      if (!url) return '/logo.jpeg';
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      // If it's a relative path starting with /uploads, fall back to logo since CMS files don't exist
      if (url.startsWith('/uploads/')) {
        return '/logo.jpeg';
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

    // Transform the story data
    const story = rows[0];
    // Generate slug from title if not exists (for consistency) - trim whitespace first
    const cleanTitle = story.title?.trim() || '';
    const slug = story.slug || cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || String(story.id);
    
    const transformed = {
      ...story,
      slug,
      author_avatar: getAvatarUrl(story.author_avatar)
    };

    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Get latest stories
router.get('/latest', cache(300), async (req, res, next) => {
  try {
    const limit = req.query.limit || 10;
    const [rows] = await pool.query(
      `SELECT s.*, a.name as author_name 
       FROM stories s 
       LEFT JOIN authors a ON s.author_id = a.id 
       WHERE s.status = 'published'
       ORDER BY s.created_at DESC 
       LIMIT ?`,
      [limit]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Get featured story
router.get('/featured', cache(300), async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, a.name as author_name 
       FROM stories s 
       LEFT JOIN authors a ON s.author_id = a.id 
       WHERE s.featured = 1 AND s.status = 'published' 
       ORDER BY s.created_at DESC 
       LIMIT 1`
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'No featured story found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get recent stories
router.get('/recent', cache(300), async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const [rows] = await pool.query(
      `SELECT s.*, a.name as author_name 
       FROM stories s 
       LEFT JOIN authors a ON s.author_id = a.id 
       WHERE s.status = 'published'
       ORDER BY s.created_at DESC 
       LIMIT ?`,
      [limit]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Search stories
router.get('/search', cache(60), async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    const [rows] = await pool.query(
      `SELECT s.*, a.name as author_name 
       FROM stories s 
       LEFT JOIN authors a ON s.author_id = a.id 
       WHERE (s.title LIKE ? OR s.content LIKE ?) AND s.status = 'published'
       ORDER BY s.created_at DESC 
       LIMIT ? OFFSET ?`,
      [`%${q}%`, `%${q}%`, limit, offset]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Get story categories
router.get('/categories', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT category FROM stories WHERE category IS NOT NULL ORDER BY category'
    );
    const categories = rows.map(row => row.category);
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

// Get authors
router.get('/authors', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const [rows] = await pool.query(
      'SELECT * FROM authors ORDER BY name LIMIT ? OFFSET ?',
      [limit, offset]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Get author by ID
router.get('/authors/:authorId', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM authors WHERE id = ?',
      [req.params.authorId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Author not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get popular stories
router.get('/popular', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const [rows] = await pool.query(
      `SELECT s.*, a.name as author_name 
       FROM stories s 
       LEFT JOIN authors a ON s.author_id = a.id 
       WHERE s.status = 'published'
       ORDER BY s.views DESC 
       LIMIT ?`,
      [limit]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Get stories by category
router.get('/category/:category', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    const [rows] = await pool.query(
      `SELECT s.*, a.name as author_name 
       FROM stories s 
       LEFT JOIN authors a ON s.author_id = a.id 
       WHERE s.category_id = ? AND s.status = 'published'
       ORDER BY s.created_at DESC 
       LIMIT ? OFFSET ?`,
      [req.params.category, limit, offset]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Get stories by author
router.get('/author/:authorId', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, a.name as author_name 
       FROM stories s 
       LEFT JOIN authors a ON s.author_id = a.id 
       WHERE s.author_id = ? 
       ORDER BY s.created_at DESC`,
      [req.params.authorId]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Create story
router.post('/', async (req, res, next) => {
  try {
    const { title, content, featured_image_url, author_id, category_id, tags } = req.body;
    const [result] = await pool.query(
      `INSERT INTO stories (title, content, featured_image_url, author_id, category_id, tags) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, content, featured_image_url, author_id, category_id, tags]
    );
    const [newStory] = await pool.query(
      `SELECT s.*, a.name as author_name 
       FROM stories s 
       LEFT JOIN authors a ON s.author_id = a.id 
       WHERE s.id = ?`,
      [result.insertId]
    );
    
    // Invalidate cache
    const { cacheDelPattern } = await import('../config/redis.js');
    await cacheDelPattern(cachePatterns.stories);
    
    res.status(201).json({ success: true, data: newStory[0] });
  } catch (error) {
    next(error);
  }
});

// Update story
router.put('/:id', async (req, res, next) => {
  try {
    const { title, content, featured_image_url, author_id, category_id, tags } = req.body;
    await pool.query(
      `UPDATE stories 
       SET title = ?, content = ?, featured_image_url = ?, author_id = ?, category_id = ?, tags = ?
       WHERE id = ?`,
      [title, content, featured_image_url, author_id, category_id, tags, req.params.id]
    );
    const [updated] = await pool.query(
      `SELECT s.*, a.name as author_name 
       FROM stories s 
       LEFT JOIN authors a ON s.author_id = a.id 
       WHERE s.id = ?`,
      [req.params.id]
    );
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Delete story
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM stories WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Story deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Toggle featured status
router.patch('/:id/featured', async (req, res, next) => {
  try {
    const { featured } = req.body;
    await pool.query(
      'UPDATE stories SET featured = ? WHERE id = ?',
      [featured ? 1 : 0, req.params.id]
    );
    const [updated] = await pool.query(
      `SELECT s.*, a.name as author_name
       FROM stories s
       LEFT JOIN authors a ON s.author_id = a.id
       WHERE s.id = ?`,
      [req.params.id]
    );
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Like a story
router.post('/:id/like', auth, async (req, res, next) => {
  try {
    const user_id = req.userId;
    const story_id = req.params.id;

    // Check if already liked
    const [existing] = await pool.query(
      'SELECT * FROM likes WHERE user_id = ? AND story_id = ?',
      [user_id, story_id]
    );

    if (existing.length > 0) {
      // Unlike
      await pool.query(
        'DELETE FROM likes WHERE user_id = ? AND story_id = ?',
        [user_id, story_id]
      );
      const [likes] = await pool.query(
        'SELECT COUNT(*) as count FROM likes WHERE story_id = ?',
        [story_id]
      );
      return res.json({ success: true, liked: false, likes: likes[0].count });
    } else {
      // Like
      await pool.query(
        'INSERT INTO likes (user_id, story_id) VALUES (?, ?)',
        [user_id, story_id]
      );
      const [likes] = await pool.query(
        'SELECT COUNT(*) as count FROM likes WHERE story_id = ?',
        [story_id]
      );
      return res.json({ success: true, liked: true, likes: likes[0].count });
    }
  } catch (error) {
    next(error);
  }
});

// Get likes count for a story
router.get('/:id/likes', async (req, res, next) => {
  try {
    // Check if likes table exists
    const [tableCheck] = await pool.query(
      "SHOW TABLES LIKE 'likes'"
    );

    if (tableCheck.length === 0) {
      // Table doesn't exist, return 0
      return res.json({ success: true, likes: 0 });
    }

    const [likes] = await pool.query(
      'SELECT COUNT(*) as count FROM likes WHERE story_id = ?',
      [req.params.id]
    );
    res.json({ success: true, likes: likes[0].count });
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.json({ success: true, likes: 0 }); // Return 0 instead of error
  }
});

// Add comment to a story
router.post('/:id/comments', auth, async (req, res, next) => {
  try {
    const user_id = req.userId;
    const { content, parent_id } = req.body;
    const story_id = req.params.id;

    // Check if comments table exists
    const [tableCheck] = await pool.query(
      "SHOW TABLES LIKE 'comments'"
    );

    if (tableCheck.length === 0) {
      return res.status(500).json({ success: false, error: 'Comments table does not exist' });
    }

    const [result] = await pool.query(
      'INSERT INTO comments (user_id, story_id, content, parent_id) VALUES (?, ?, ?, ?)',
      [user_id, story_id, content, parent_id || null]
    );

    // Get the comment with user info
    const [comment] = await pool.query(
      `SELECT c.*, u.first_name, u.last_name, u.email
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    );

    res.json({ success: true, data: comment[0] });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, error: 'Failed to add comment' });
  }
});

// Get comments for a story
router.get('/:id/comments', async (req, res, next) => {
  try {
    // Check if comments table exists
    const [tableCheck] = await pool.query(
      "SHOW TABLES LIKE 'comments'"
    );

    if (tableCheck.length === 0) {
      // Table doesn't exist, return empty array
      return res.json({ success: true, data: [] });
    }

    const [comments] = await pool.query(
      `SELECT c.*, u.first_name, u.last_name, u.email
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.story_id = ? AND c.parent_id IS NULL
       ORDER BY c.created_at DESC`,
      [req.params.id]
    );
    res.json({ success: true, data: comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.json({ success: true, data: [] }); // Return empty array instead of error
  }
});

// Track share
router.post('/:id/share', async (req, res, next) => {
  try {
    const { user_id, platform } = req.body;
    const story_id = req.params.id;

    await pool.query(
      'INSERT INTO shares (story_id, user_id, platform) VALUES (?, ?, ?)',
      [story_id, user_id, platform]
    );

    const [shares] = await pool.query(
      'SELECT COUNT(*) as count FROM shares WHERE story_id = ?',
      [story_id]
    );

    res.json({ success: true, shares: shares[0].count });
  } catch (error) {
    next(error);
  }
});

export default router;
