import express from 'express';
import pool from '../config/database.js';
import multer from 'multer';
import { uploadToCloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

const router = express.Router();

// Configure multer for memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
  }
});

// Helper function to get image URL (handle Cloudinary and CMS uploads)
const getImageUrl = (url, category = null) => {
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

  // If URL is empty or undefined, use category-based image or default
  if (!url || url === 'undefined' || url === '/uploads/stories/undefined' || url === '') {
    return categoryImageMap[category] || '/community.jpeg';
  }

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

// Get all communities
router.get('/', async (req, res, next) => {
  try {
    const { category, community_type, status, page = 1, limit = 25 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM communities WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (community_type) {
      query += ' AND community_type = ?';
      params.push(community_type);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY member_count DESC LIMIT ? OFFSET ?';
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
    console.error('Error fetching communities:', error);
    // Handle database connection errors specifically
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'PROTOCOL_CONNECTION_LOST') {
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

// Create community (admin only)
router.post('/', async (req, res, next) => {
  try {
    const { 
      name, 
      slug, 
      description, 
      short_description, 
      category, 
      icon_url, 
      cover_image_url, 
      community_type, 
      status,
      rules,
      created_by
    } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO communities (
        name, 
        slug, 
        description, 
        short_description, 
        category, 
        icon_url, 
        cover_image_url, 
        community_type, 
        status,
        rules,
        created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        slug,
        description,
        short_description,
        category,
        icon_url,
        cover_image_url,
        community_type || 'open',
        status || 'active',
        rules,
        created_by
      ]
    );
    
    const [newCommunity] = await pool.query(
      'SELECT * FROM communities WHERE id = ?',
      [result.insertId]
    );
    // Transform image URLs to serve CMS uploads
    const transformed = {
      ...newCommunity[0],
      cover_image_url: getImageUrl(newCommunity[0].cover_image_url, newCommunity[0].category),
      icon_url: getImageUrl(newCommunity[0].icon_url, newCommunity[0].category)
    };
    res.status(201).json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Update community (admin only)
router.put('/:id', async (req, res, next) => {
  try {
    const { 
      name, 
      slug, 
      description, 
      short_description, 
      category, 
      icon_url, 
      cover_image_url, 
      member_count, 
      post_count,
      community_type, 
      status,
      rules
    } = req.body;
    
    await pool.query(
      `UPDATE communities SET 
        name = ?, 
        slug = ?, 
        description = ?, 
        short_description = ?, 
        category = ?, 
        icon_url = ?, 
        cover_image_url = ?, 
        member_count = ?, 
        post_count = ?,
        community_type = ?, 
        status = ?,
        rules = ?
      WHERE id = ?`,
      [
        name,
        slug,
        description,
        short_description,
        category,
        icon_url,
        cover_image_url,
        member_count,
        post_count,
        community_type,
        status,
        rules,
        req.params.id
      ]
    );
    
    const [updated] = await pool.query(
      'SELECT * FROM communities WHERE id = ?',
      [req.params.id]
    );
    // Transform image URLs to serve CMS uploads
    const transformed = {
      ...updated[0],
      cover_image_url: getImageUrl(updated[0].cover_image_url, updated[0].category),
      icon_url: getImageUrl(updated[0].icon_url, updated[0].category)
    };
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Delete community (admin only)
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM communities WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, message: 'Community deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get user's communities
router.get('/user/:userId', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, cm.role, cm.status as membership_status, cm.joined_at
       FROM communities c
       INNER JOIN community_members cm ON c.id = cm.community_id
       WHERE cm.user_id = ? AND cm.status = 'active'
       ORDER BY cm.joined_at DESC`,
      [req.params.userId]
    );
    
    // Transform image URLs to serve CMS uploads
    const transformed = rows.map(community => ({
      ...community,
      cover_image_url: getImageUrl(community.cover_image_url, community.category),
      icon_url: getImageUrl(community.icon_url, community.category)
    }));
    
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Join community
router.post('/:communityId/join', async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    // Check if user is already a member
    const [existing] = await pool.query(
      'SELECT * FROM community_members WHERE user_id = ? AND community_id = ?',
      [userId, req.params.communityId]
    );
    
    if (existing.length > 0) {
      // If left, reactivate
      if (existing[0].status === 'left') {
        await pool.query(
          `UPDATE community_members 
           SET status = 'active', left_at = NULL 
           WHERE user_id = ? AND community_id = ?`,
          [userId, req.params.communityId]
        );
      } else {
        return res.status(400).json({ success: false, error: 'User is already a member of this community' });
      }
    } else {
      // Add new member
      await pool.query(
        `INSERT INTO community_members (user_id, community_id, role, status)
         VALUES (?, ?, 'member', 'active')`,
        [userId, req.params.communityId]
      );
    }
    
    // Increment community member count
    await pool.query(
      'UPDATE communities SET member_count = member_count + 1 WHERE id = ?',
      [req.params.communityId]
    );
    
    res.json({ success: true, message: 'Successfully joined community' });
  } catch (error) {
    next(error);
  }
});

// Leave community
router.post('/:communityId/leave', async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    await pool.query(
      `UPDATE community_members 
       SET status = 'left', left_at = CURRENT_TIMESTAMP 
       WHERE user_id = ? AND community_id = ? AND status = 'active'`,
      [userId, req.params.communityId]
    );
    
    // Decrement community member count
    await pool.query(
      'UPDATE communities SET member_count = GREATEST(0, member_count - 1) WHERE id = ?',
      [req.params.communityId]
    );
    
    res.json({ success: true, message: 'Successfully left community' });
  } catch (error) {
    next(error);
  }
});

// Get community members
router.get('/:communityId/members', async (req, res, next) => {
  try {
    const { status = 'active', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const [rows] = await pool.query(
      `SELECT cm.*, u.username, u.email, u.first_name, u.last_name
       FROM community_members cm
       INNER JOIN users u ON cm.user_id = u.id
       WHERE cm.community_id = ? AND cm.status = ?
       ORDER BY cm.joined_at DESC
       LIMIT ? OFFSET ?`,
      [req.params.communityId, status, parseInt(limit), offset]
    );
    
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Check if user is member of community
router.get('/:communityId/membership/:userId', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM community_members WHERE user_id = ? AND community_id = ?',
      [req.params.userId, req.params.communityId]
    );

    if (rows.length === 0) {
      return res.json({ success: true, data: { isMember: false } });
    }

    res.json({
      success: true,
      data: {
        isMember: true,
        membership: rows[0]
      }
    });
  } catch (error) {
    next(error);
  }
});

// Upload community image to Cloudinary
router.post('/upload-image', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(500).json({ success: false, error: 'Cloudinary not configured' });
    }

    // Convert buffer to base64 for Cloudinary upload
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(
      { path: base64 },
      'communities'
    );

    res.json({ success: true, data: { url: result.url, public_id: result.public_id } });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
