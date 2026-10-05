import express from 'express';
import { redisAuthLimiter } from '../../middleware/redisRateLimiter.js';
import { UserService } from '../../services/userService.js';
import { logFailedLogin, logSuccessfulLogin, logAccountLockout } from '../../middleware/securityLogger.js';

const router = express.Router();

router.post('/register', redisAuthLimiter, async (req, res, next) => {
  try {
    console.log('Registration attempt for new user');
    const { username, email, password, first_name, last_name } = req.body;

    if (!email || !password || !username) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Email, password, and username are required'
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    console.log('Checking for existing user email');

    const existingEmailUser = await UserService.findUserByEmail(normalizedEmail);
    if (existingEmailUser) {
      console.log('User already exists with provided email');
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    console.log('Checking for existing username');

    const existingUsernameUser = await UserService.findUserByUsername(normalizedUsername);
    if (existingUsernameUser) {
      console.log('Username already taken');
      return res.status(409).json({
        success: false,
        error: 'Username already taken'
      });
    }

    console.log('Creating user...');

    const userData = await UserService.createUser({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
      first_name,
      last_name
    });

    console.log('User created successfully');

    const token = UserService.generateToken(userData);

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.status(201).json({
      success: true,
      data: userData,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    console.error('Error stack:', error.stack);
    next(error);
  }
});

router.post('/login', redisAuthLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent') || 'unknown';

    console.log('Login attempt received');

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const lockStatus = await UserService.isAccountLocked(normalizedEmail);
    if (lockStatus.locked) {
      logAccountLockout(normalizedEmail, ip, userAgent);
      return res.status(423).json({
        success: false,
        error: `Account locked due to too many failed attempts. Try again in ${lockStatus.remainingTime} minutes.`
      });
    }

    const user = await UserService.findUserByEmail(normalizedEmail);

    if (!user) {
      await UserService.recordFailedLoginAttempt(normalizedEmail);
      logFailedLogin(normalizedEmail, ip, userAgent);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const isPasswordValid = await UserService.comparePassword(password, user.password);

    if (!isPasswordValid) {
      const shouldLock = await UserService.recordFailedLoginAttempt(normalizedEmail);
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

    await UserService.clearFailedLoginAttempts(normalizedEmail);
    logSuccessfulLogin(user.id, normalizedEmail, ip, userAgent);

    const token = UserService.generateToken(user);

    const userWithoutPassword = UserService.sanitizeUser(user);

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.json({
      success: true,
      data: {
        user: userWithoutPassword
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

router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/'
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
});

export default router;
