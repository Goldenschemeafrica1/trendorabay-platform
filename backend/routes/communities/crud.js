import express from 'express';
import pool from '../../config/database.js';
import multer from 'multer';
import { uploadToCloudinary, isCloudinaryConfigured } from '../../config/cloudinary.js';
import { getImageUrl } from '../../utils/imageHelpers.js';

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

// Create community (admin only)
router.post('/', upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), async (req, res, next) => {
  try {
    const { 
      name, 
      slug, 
      description, 
      short_description, 
      category, 
      community_type, 
      status,
      rules,
      created_by
    } = req.body;
    
    let icon_url = req.body.icon_url;
    let cover_image_url = req.body.cover_image_url;
    
    // Upload to Cloudinary if configured and files provided
    if (isCloudinaryConfigured()) {
      if (req.files.icon && req.files.icon[0]) {
        const iconResult = await uploadToCloudinary(req.files.icon[0].buffer);
        icon_url = iconResult.secure_url;
      }
      if (req.files.cover && req.files.cover[0]) {
        const coverResult = await uploadToCloudinary(req.files.cover[0].buffer);
        cover_image_url = coverResult.secure_url;
      }
    }
    
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
    
    // Transform image URLs
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

// Update community
router.put('/:id', upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), async (req, res, next) => {
  try {
    const { 
      name, 
      slug, 
      description, 
      short_description, 
      category, 
      community_type, 
      status,
      rules
    } = req.body;
    
    let icon_url = req.body.icon_url;
    let cover_image_url = req.body.cover_image_url;
    
    // Upload to Cloudinary if configured and files provided
    if (isCloudinaryConfigured()) {
      if (req.files.icon && req.files.icon[0]) {
        const iconResult = await uploadToCloudinary(req.files.icon[0].buffer);
        icon_url = iconResult.secure_url;
      }
      if (req.files.cover && req.files.cover[0]) {
        const coverResult = await uploadToCloudinary(req.files.cover[0].buffer);
        cover_image_url = coverResult.secure_url;
      }
    }
    
    await pool.query(
      `UPDATE communities SET 
        name = ?, 
        slug = ?, 
        description = ?, 
        short_description = ?, 
        category = ?, 
        icon_url = ?, 
        cover_image_url = ?, 
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
        community_type || 'open',
        status || 'active',
        rules,
        req.params.id
      ]
    );
    
    const [updated] = await pool.query(
      'SELECT * FROM communities WHERE id = ?',
      [req.params.id]
    );
    
    // Transform image URLs
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

// Delete community
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

export default router;
