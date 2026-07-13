import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get author by ID or name
router.get('/:id', async (req, res, next) => {
  try {
    const authorId = req.params.id;

    // Check if the ID is numeric (ID) or string (name)
    const isNumeric = /^\d+$/.test(authorId);

    let authors;
    if (isNumeric) {
      // Search by ID
      [authors] = await pool.query(
        'SELECT * FROM authors WHERE id = ?',
        [authorId]
      );
    } else {
      // Search by name
      [authors] = await pool.query(
        'SELECT * FROM authors WHERE name = ?',
        [authorId]
      );
    }

    if (authors.length === 0) {
      return res.status(404).json({ success: false, error: 'Author not found' });
    }

    const author = authors[0];

    // Get stories by this author
    const [stories] = await pool.query(
      `SELECT s.*, c.name as category_name
       FROM stories s
       LEFT JOIN categories c ON s.category_id = c.id
       WHERE s.author_id = ? AND s.status = 'published'
       ORDER BY s.published_at DESC`,
      [author.id]
    );

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

    // Helper function to get avatar URL (serve CMS uploads)
    const getAvatarUrl = (url) => {
      if (!url) return '/logo.jpeg';
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      // If it's a relative path starting with /uploads, serve from backend
      if (url.startsWith('/uploads/')) {
        return `${process.env.BACKEND_URL || 'http://localhost:3001'}${url}`;
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

    // Transform stories to include proper image URLs
    const transformedStories = stories.map(story => ({
      ...story,
      featured_image_url: getImageUrl(story.featured_image_url, story.category_name)
    }));

    // Transform author avatar URL
    const transformedAuthor = {
      ...author,
      avatar_url: getAvatarUrl(author.avatar_url)
    };

    // Calculate stats
    const stats = {
      stories: transformedStories.length,
      views: transformedStories.reduce((sum, story) => sum + (story.views || 0), 0)
    };

    res.json({
      success: true,
      data: {
        ...transformedAuthor,
        stats,
        stories: transformedStories
      }
    });
  } catch (error) {
    console.error('Error fetching author:', error);
    next(error);
  }
});

// Follow an author
router.post('/:id/follow', async (req, res, next) => {
  try {
    const authorId = req.params.id;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    // Check if the ID is numeric (ID) or string (name)
    const isNumeric = /^\d+$/.test(authorId);
    let authors;
    
    if (isNumeric) {
      [authors] = await pool.query('SELECT * FROM authors WHERE id = ?', [authorId]);
    } else {
      [authors] = await pool.query('SELECT * FROM authors WHERE name = ?', [authorId]);
    }

    if (authors.length === 0) {
      return res.status(404).json({ success: false, error: 'Author not found' });
    }

    const author = authors[0];

    // Insert follow relationship
    await pool.query(
      'INSERT INTO author_follows (user_id, author_id) VALUES (?, ?)',
      [user_id, author.id]
    );

    res.json({ success: true, message: 'Author followed successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, error: 'Already following this author' });
    }
    console.error('Error following author:', error);
    next(error);
  }
});

// Unfollow an author
router.delete('/:id/follow', async (req, res, next) => {
  try {
    const authorId = req.params.id;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    // Check if the ID is numeric (ID) or string (name)
    const isNumeric = /^\d+$/.test(authorId);
    let authors;
    
    if (isNumeric) {
      [authors] = await pool.query('SELECT * FROM authors WHERE id = ?', [authorId]);
    } else {
      [authors] = await pool.query('SELECT * FROM authors WHERE name = ?', [authorId]);
    }

    if (authors.length === 0) {
      return res.status(404).json({ success: false, error: 'Author not found' });
    }

    const author = authors[0];

    // Delete follow relationship
    const [result] = await pool.query(
      'DELETE FROM author_follows WHERE user_id = ? AND author_id = ?',
      [user_id, author.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Follow relationship not found' });
    }

    res.json({ success: true, message: 'Author unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing author:', error);
    next(error);
  }
});

// Check if user is following an author
router.get('/:id/follow/:userId', async (req, res, next) => {
  try {
    const authorId = req.params.id;
    const userId = req.params.userId;

    // Check if the ID is numeric (ID) or string (name)
    const isNumeric = /^\d+$/.test(authorId);
    let authors;
    
    if (isNumeric) {
      [authors] = await pool.query('SELECT * FROM authors WHERE id = ?', [authorId]);
    } else {
      [authors] = await pool.query('SELECT * FROM authors WHERE name = ?', [authorId]);
    }

    if (authors.length === 0) {
      return res.status(404).json({ success: false, error: 'Author not found' });
    }

    const author = authors[0];

    const [follows] = await pool.query(
      'SELECT * FROM author_follows WHERE user_id = ? AND author_id = ?',
      [userId, author.id]
    );

    res.json({ success: true, isFollowing: follows.length > 0 });
  } catch (error) {
    console.error('Error checking follow status:', error);
    next(error);
  }
});

export default router;
