import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../config/database.js';
import auth from '../middleware/auth.js';
import { logFailedLogin, logSuccessfulLogin, logAccountLockout } from '../middleware/securityLogger.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/profiles';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
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
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
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
    next(error);
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

    let users;
    try {
      const [usersWithProfile] = await pool.query(
        'SELECT id, username, email, first_name, last_name, profile_image, role, created_at FROM users WHERE id = ?',
        [userId]
      );
      users = usersWithProfile;
    } catch (error) {
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
    next(error);
  }
});

// Update user profile (protected route)
router.put('/profile', auth, upload.single('profile_image'), async (req, res, next) => {
  try {
    const userId = req.userId; // Set by auth middleware
    const { first_name, last_name } = req.body;

    let query = `UPDATE users SET first_name = ?, last_name = ?`;
    const params = [first_name, last_name];

    // Handle profile image upload
    if (req.file) {
      const profileImageUrl = `http://localhost:3001/uploads/profiles/${req.file.filename}`;
      try {
        // Test if profile_image column exists
        await pool.query('SELECT profile_image FROM users LIMIT 1');
        query += `, profile_image = ?`;
        params.push(profileImageUrl);
      } catch (error) {
        // Column doesn't exist, skip profile_image update
        console.log('profile_image column does not exist, skipping update');
      }
    }

    query += ` WHERE id = ?`;
    params.push(userId);

    await pool.query(query, params);

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

export default router;
