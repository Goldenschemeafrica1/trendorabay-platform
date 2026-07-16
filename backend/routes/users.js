import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import pool from '../config/database.js';
import auth from '../middleware/auth.js';
import { logFailedLogin, logSuccessfulLogin, logAccountLockout } from '../middleware/securityLogger.js';

const router = express.Router();

// Configure multer for file uploads (memory storage for production)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
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

// Helper function to upload image to CMS
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
    return data.url; // Assuming CMS returns { url: '...' }
  } catch (error) {
    console.error('Error uploading to CMS:', error);
    // Fallback: store as base64 data URL (temporary solution)
    const base64 = file.buffer.toString('base64');
    return `data:${file.mimetype};base64,${base64}`;
  }
};

// Register new user
router.post('/register', async (req, res, next) => {
  try {
    console.log('Registration attempt:', { username: req.body.username, email: req.body.email });
    const { username, email, password, first_name, last_name } = req.body;

    // Validate input
    if (!email || !password || !username) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Email, password, and username are required'
      });
    }

    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
      });
    }

    // Normalize email (trim and lowercase)
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    console.log('Checking for existing user with email:', normalizedEmail);

    // Check if user already exists by email (case-insensitive)
    const [existingEmailUsers] = await pool.query(
      'SELECT id FROM users WHERE LOWER(email) = ?',
      [normalizedEmail]
    );

    if (existingEmailUsers.length > 0) {
      console.log('User already exists with email:', normalizedEmail);
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    console.log('Checking for existing username:', normalizedUsername);

    // Check if username already exists (case-insensitive)
    const [existingUsernameUsers] = await pool.query(
      'SELECT id FROM users WHERE LOWER(username) = ?',
      [normalizedUsername]
    );

    if (existingUsernameUsers.length > 0) {
      console.log('Username already taken:', normalizedUsername);
      return res.status(409).json({
        success: false,
        error: 'Username already taken'
      });
    }

    console.log('Hashing password...');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Inserting user into database...');

    // Insert user with normalized values
    const [result] = await pool.query(
      `INSERT INTO users (username, email, password, first_name, last_name)
       VALUES (?, ?, ?, ?, ?)`,
      [normalizedUsername, normalizedEmail, hashedPassword, first_name || null, last_name || null]
    );

    console.log('User inserted with ID:', result.insertId);

    // Return success immediately after successful insertion
    // Don't fetch user data to avoid potential errors
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        username: normalizedUsername,
        email: normalizedEmail,
        first_name: first_name || null,
        last_name: last_name || null
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    console.error('Error stack:', error.stack);
    next(error);
  }
});

// Login user
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent') || 'unknown';

    console.log('Login attempt for email:', email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Create login_attempts table if it doesn't exist
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS login_attempts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          attempts INT DEFAULT 1,
          last_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          locked_until TIMESTAMP NULL,
          INDEX idx_email (email)
        )
      `);
    } catch (error) {
      console.error('Error creating login_attempts table:', error);
    }

    // Check if account is locked
    try {
      const [lockedAccounts] = await pool.query(
        'SELECT * FROM login_attempts WHERE email = ? AND locked_until > NOW()',
        [normalizedEmail]
      );

      if (lockedAccounts.length > 0) {
        const lockedAccount = lockedAccounts[0];
        const remainingTime = Math.ceil((new Date(lockedAccount.locked_until) - new Date()) / 1000 / 60);
        logAccountLockout(normalizedEmail, ip, userAgent);
        return res.status(423).json({
          success: false,
          error: `Account locked due to too many failed attempts. Try again in ${remainingTime} minutes.`
        });
      }
    } catch (error) {
      console.error('Error checking locked accounts:', error);
      // Continue with login if table check fails
    }

    // Find user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [normalizedEmail]
    );

    if (users.length === 0) {
      // Record failed attempt for non-existent email (prevent enumeration)
      await recordFailedLoginAttempt(normalizedEmail);
      logFailedLogin(normalizedEmail, ip, userAgent);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Record failed attempt
      const shouldLock = await recordFailedLoginAttempt(normalizedEmail);
      logFailedLogin(normalizedEmail, ip, userAgent);

      if (shouldLock) {
        logAccountLockout(normalizedEmail, ip, userAgent);
        return res.status(423).json({
          success: false,
          error: 'Too many failed login attempts. Account locked for 15 minutes.'
        });
      }

      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Clear failed attempts on successful login
    await pool.query(
      'DELETE FROM login_attempts WHERE email = ?',
      [normalizedEmail]
    );

    // Log successful login
    logSuccessfulLogin(user.id, normalizedEmail, ip, userAgent);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_here',
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Login failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper function to record failed login attempts
const recordFailedLoginAttempt = async (email) => {
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15; // minutes

  try {
    // Create login_attempts table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        attempts INT DEFAULT 1,
        last_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        locked_until TIMESTAMP NULL,
        INDEX idx_email (email)
      )
    `);

    // Check if there are existing attempts
    const [existing] = await pool.query(
      'SELECT * FROM login_attempts WHERE email = ?',
      [email]
    );

    if (existing.length === 0) {
      // First failed attempt
      await pool.query(
        'INSERT INTO login_attempts (email, attempts) VALUES (?, 1)',
        [email]
      );
      return false;
    }

    const record = existing[0];
    const newAttempts = record.attempts + 1;

    if (newAttempts >= MAX_ATTEMPTS) {
      // Lock the account
      const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION * 60 * 1000);
      await pool.query(
        'UPDATE login_attempts SET attempts = ?, last_attempt = NOW(), locked_until = ? WHERE email = ?',
        [newAttempts, lockedUntil, email]
      );
      return true; // Account locked
    } else {
      // Increment attempts
      await pool.query(
        'UPDATE login_attempts SET attempts = ?, last_attempt = NOW() WHERE email = ?',
        [newAttempts, email]
      );
      return false;
    }
  } catch (error) {
    console.error('Error recording failed login attempt:', error);
    return false;
  }
};

// Get user profile (protected route)
router.get('/profile', auth, async (req, res, next) => {
  try {
    const userId = req.userId; // Set by auth middleware
    console.log('Fetching profile for userId:', userId);

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
      // If profile_image column doesn't exist, select without it
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

    console.log('User profile data:', users[0]);
    res.json({ success: true, data: users[0] });
  } catch (error) {
    console.error('Error fetching profile:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      stack: error.stack
    });
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      details: process.env.NODE_ENV === 'development' ? error.message : error.message
    });
  }
});

// Update user profile (protected route)
router.put('/profile', auth, upload.single('profile_image'), async (req, res, next) => {
  try {
    const userId = req.userId; // Set by auth middleware
    const { first_name, last_name } = req.body;

    console.log('=== Profile Update Request ===');
    console.log('User ID:', userId);
    console.log('Request body:', { first_name, last_name });
    console.log('File received:', req.file ? 'Yes' : 'No');

    let query = `UPDATE users SET first_name = ?, last_name = ?`;
    const params = [first_name, last_name];

    // Handle profile image upload
    if (req.file) {
      console.log('File details:', {
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });

      // Upload to CMS
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = 'profile-' + uniqueSuffix + path.extname(req.file.originalname);
      const profileImageUrl = await uploadToCMS(req.file, filename);

      console.log('Profile image URL:', profileImageUrl);

      try {
        // Test if profile_image column exists, create it if it doesn't
        await pool.query('SELECT profile_image FROM users LIMIT 1');
        console.log('profile_image column exists');
        
        // Check if column is VARCHAR(500) and needs to be upgraded to TEXT
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
        // Column doesn't exist, create it as TEXT
        console.log('Creating profile_image column as TEXT...');
        await pool.query('ALTER TABLE users ADD COLUMN profile_image TEXT');
      }

      query += `, profile_image = ?`;
      params.push(profileImageUrl);
    }

    query += ` WHERE id = ?`;
    params.push(userId);

    console.log('Executing query:', query);
    console.log('Query params:', params);

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
      // If profile_image column doesn't exist, select without it
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

// Clear invalid profile image data (temporary fix)
router.post('/clear-invalid-profile-images', auth, async (req, res, next) => {
  try {
    const userId = req.userId;
    
    // Clear profile_image if it starts with 'data:' (base64 data)
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

// Forgot password
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check if user exists
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [normalizedEmail]
    );
    
    if (users.length === 0) {
      // For security, still return success even if user doesn't exist
      // This prevents email enumeration
      return res.json({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.'
      });
    }
    
    const user = users[0];
    
    // Generate a reset token
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_here',
      { expiresIn: '1h' } // Token expires in 1 hour
    );
    
    // In a production environment, you would send an email with the reset link
    // For now, we'll just return success
    // The reset link would be: `${frontendUrl}/reset-password?token=${resetToken}`
    
    console.log('Password reset token generated for user:', user.email);
    console.log('Reset token:', resetToken);
    
    res.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process request'
    });
  }
});

// Reset password
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Token and new password are required'
      });
    }
    
    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
      });
    }
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, decoded.userId]
    );
    
    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to reset password'
    });
  }
});

export default router;
