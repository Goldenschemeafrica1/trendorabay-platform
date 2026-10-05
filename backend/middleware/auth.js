import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    // Try to get token from httpOnly cookie first, fallback to Authorization header
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('Auth failed: No token found. Cookies:', Object.keys(req.cookies || {}));
      return res.status(401).json({
        success: false,
        error: 'No authentication token, access denied'
      });
    }

    // Fail-fast if JWT_SECRET is not set
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET not set in environment variables. Authentication cannot function.');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: JWT secret not configured'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    console.log('Auth failed: Token verification error:', error.message);
    res.status(401).json({
      success: false,
      error: 'Token is not valid'
    });
  }
};

export default auth;
