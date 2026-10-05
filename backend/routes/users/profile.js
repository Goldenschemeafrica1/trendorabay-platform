import express from 'express';
import multer from 'multer';
import path from 'path';
import pool from '../../config/database.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const uploadToCMS = async (file, filename) => {
  try {
    const cmsUrl = process.env.CMS_URL || 'https://trendorabay-content-management-system.onrender.com';
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: filename,
      contentType: file.mimetype
    });
    formData.append('folder', 'profiles');

    const response = await fetch(`${cmsUrl}/api/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('CMS upload failed');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading to CMS:', error);
    const base64 = file.buffer.toString('base64');
    return `data:${file.mimetype};base64,${base64}`;
  }
};

router.get('/profile', auth, async (req, res, next) => {
  try {
    const userId = req.userId;
    console.log('Fetching user profile');

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Invalid user ID from token'
      });
    }

    let users;
    try {
      const [usersWithProfile] = await pool.query(
        'SELECT id, username, email, first_name, last_name, profile_image, role, created_at FROM users WHERE id = ?',
        [userId]
      );
      users = usersWithProfile;
    } catch (error) {
      console.log('profile_image column error, trying fallback:', error.message);
      const [usersWithoutProfile] = await pool.query(
        'SELECT id, username, email, first_name, last_name, role, created_at FROM users WHERE id = ?',
        [userId]
      );
      users = usersWithoutProfile;
    }

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    console.log('User profile fetched successfully');
    res.json({ success: true, data: users[0] });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

router.put('/profile', auth, upload.single('profile_image'), async (req, res, next) => {
  try {
    const userId = req.userId;
    const { first_name, last_name } = req.body;

    console.log('=== Profile Update Request ===');
    console.log('Processing profile update request');
    console.log('Profile update data received');
    console.log('File received:', req.file ? 'Yes' : 'No');

    let query = `UPDATE users SET first_name = ?, last_name = ?`;
    const params = [first_name, last_name];

    if (req.file) {
      console.log('File upload received for profile image');

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = 'profile-' + uniqueSuffix + path.extname(req.file.originalname);
      const profileImageUrl = await uploadToCMS(req.file, filename);

      console.log('Profile image uploaded successfully');

      try {
        await pool.query('SELECT profile_image FROM users LIMIT 1');
        console.log('profile_image column exists');
        
        const [columnInfo] = await pool.query(`
          SELECT COLUMN_TYPE 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_NAME = 'users' 
          AND COLUMN_NAME = 'profile_image'
        `);
        
        if (columnInfo.length > 0 && columnInfo[0].COLUMN_TYPE.includes('varchar')) {
          console.log('Upgrading profile_image column from VARCHAR to TEXT...');
          await pool.query('ALTER TABLE users MODIFY COLUMN profile_image TEXT');
          console.log('profile_image column upgraded to TEXT');
        }
      } catch (error) {
        console.log('Creating profile_image column as TEXT...');
        await pool.query('ALTER TABLE users ADD COLUMN profile_image TEXT');
      }

      query += `, profile_image = ?`;
      params.push(profileImageUrl);
    }

    query += ` WHERE id = ?`;
    params.push(userId);

    console.log('Executing profile update query');

    await pool.query(query, params);
    console.log('Profile update successful');

    let updatedUser;
    try {
      const [userWithProfile] = await pool.query(
        'SELECT id, username, email, first_name, last_name, profile_image, role, created_at FROM users WHERE id = ?',
        [userId]
      );
      updatedUser = userWithProfile[0];
    } catch (error) {
      const [userWithoutProfile] = await pool.query(
        'SELECT id, username, email, first_name, last_name, role, created_at FROM users WHERE id = ?',
        [userId]
      );
      updatedUser = userWithoutProfile[0];
    }

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
});

router.post('/clear-invalid-profile-images', auth, async (req, res, next) => {
  try {
    const userId = req.userId;
    
    await pool.query(
      'UPDATE users SET profile_image = NULL WHERE id = ? AND (profile_image LIKE "data:%" OR LENGTH(profile_image) > 500)',
      [userId]
    );
    
    res.json({ success: true, message: 'Invalid profile images cleared' });
  } catch (error) {
    console.error('Error clearing profile images:', error);
    next(error);
  }
});

export default router;
