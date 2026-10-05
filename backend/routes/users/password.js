import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../config/database.js';
import { redisAuthLimiter } from '../../middleware/redisRateLimiter.js';

const router = express.Router();

router.post('/forgot-password', redisAuthLimiter, async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [normalizedEmail]
    );
    
    if (users.length === 0) {
      return res.json({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.'
      });
    }
    
    const user = users[0];
    
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET not set in environment variables. Cannot generate password reset token.');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: JWT secret not configured'
      });
    }

    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
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

router.post('/reset-password', redisAuthLimiter, async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Token and new password are required'
      });
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
      });
    }
    
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET not set in environment variables. Cannot verify password reset token.');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: JWT secret not configured'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
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
