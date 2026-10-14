import jwt from 'jsonwebtoken';

// Admin-only middleware for sensitive endpoints
const adminAuth = (req, res, next) => {
  try {
    // Check for admin API key (for monitoring/health endpoints)
    const adminKey = req.header('X-Admin-Key');
    if (adminKey === process.env.ADMIN_API_KEY) {
      return next();
    }

    // Fall back to JWT authentication
    const cookieToken = req.cookies?.token;
    const headerToken = req.header('Authorization')?.replace('Bearer ', '');
    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// Development-only middleware (bypasses auth in development)
const devOnly = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  return adminAuth(req, res, next);
};

export { adminAuth, devOnly };
export default adminAuth;
