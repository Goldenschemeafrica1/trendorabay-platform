import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { logFailedLogin, logSuccessfulLogin, logAccountLockout } from '../middleware/securityLogger.js';

export const UserService = {
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  },

  generateToken(user) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
  },

  async findUserByEmail(email) {
    const normalizedEmail = email.trim().toLowerCase();
    const [users] = await pool.query(
      'SELECT id, username, email, password, first_name, last_name, profile_image, role FROM users WHERE email = ?',
      [normalizedEmail]
    );
    return users[0] || null;
  },

  async findUserByUsername(username) {
    const normalizedUsername = username.trim();
    const [users] = await pool.query(
      'SELECT id FROM users WHERE LOWER(username) = ?',
      [normalizedUsername]
    );
    return users[0] || null;
  },

  async createUser(userData) {
    const { username, email, password, first_name, last_name } = userData;
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    const hashedPassword = await this.hashPassword(password);

    const [result] = await pool.query(
      `INSERT INTO users (username, email, password, first_name, last_name)
       VALUES (?, ?, ?, ?, ?)`,
      [normalizedUsername, normalizedEmail, hashedPassword, first_name || null, last_name || null]
    );

    return {
      id: result.insertId,
      username: normalizedUsername,
      email: normalizedEmail,
      first_name: first_name || null,
      last_name: last_name || null,
      profile_image: null
    };
  },

  async recordFailedLoginAttempt(email) {
    const normalizedEmail = email.trim().toLowerCase();

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

    const [existing] = await pool.query(
      'SELECT * FROM login_attempts WHERE email = ?',
      [normalizedEmail]
    );

    if (existing.length === 0) {
      await pool.query(
        'INSERT INTO login_attempts (email, attempts) VALUES (?, 1)',
        [normalizedEmail]
      );
      return false;
    }

    const attempts = existing[0].attempts + 1;
    const MAX_ATTEMPTS = 5;
    const LOCK_TIME = 15; // minutes

    if (attempts >= MAX_ATTEMPTS) {
      const lockedUntil = new Date(Date.now() + LOCK_TIME * 60 * 1000);
      await pool.query(
        'UPDATE login_attempts SET attempts = ?, last_attempt = NOW(), locked_until = ? WHERE email = ?',
        [attempts, lockedUntil, normalizedEmail]
      );
      return true;
    }

    await pool.query(
      'UPDATE login_attempts SET attempts = ?, last_attempt = NOW() WHERE email = ?',
      [attempts, normalizedEmail]
    );

    return false;
  },

  async clearFailedLoginAttempts(email) {
    const normalizedEmail = email.trim().toLowerCase();
    await pool.query(
      'DELETE FROM login_attempts WHERE email = ?',
      [normalizedEmail]
    );
  },

  async isAccountLocked(email) {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const [lockedAccounts] = await pool.query(
        'SELECT * FROM login_attempts WHERE email = ? AND locked_until > NOW()',
        [normalizedEmail]
      );

      if (lockedAccounts.length > 0) {
        const lockedAccount = lockedAccounts[0];
        const remainingTime = Math.ceil((new Date(lockedAccount.locked_until) - new Date()) / 1000 / 60);
        return { locked: true, remainingTime };
      }
    } catch (error) {
      console.error('Error checking locked accounts:', error);
    }

    return { locked: false };
  },

  sanitizeUser(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};
