import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token, access denied'
      });
    }

    // Ensure JWT_SECRET is set, use fallback for development
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_here_use_strong_random_string';
    if (!process.env.JWT_SECRET) {
      console.warn('WARNING: JWT_SECRET not set in environment variables. Using fallback (not secure for production!)');
    }

    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token is not valid'
    });
  }
};

export default auth;
