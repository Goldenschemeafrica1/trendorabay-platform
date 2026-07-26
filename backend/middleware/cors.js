import cors from 'cors';

// Normalize origin by removing trailing slashes and ensuring consistent format
const normalizeOrigin = (origin) => {
  if (!origin) return origin;
  return origin.replace(/\/$/, '');
};

// Build allowed origins list from environment and hardcoded values
const allowedOrigins = [
  normalizeOrigin(process.env.FRONTEND_URL || 'http://localhost:5173'),
  'https://trendorabay-platform-j5j0e39eq-golden-scheme-africa-s-projects.vercel.app',
  'https://trendorabay-platform.vercel.app',
  'https://trendorabay.com',
  'https://www.trendorabay.com'
];

// Add additional origins from environment variable if provided
if (process.env.ADDITIONAL_ALLOWED_ORIGINS) {
  const additionalOrigins = process.env.ADDITIONAL_ALLOWED_ORIGINS
    .split(',')
    .map(origin => normalizeOrigin(origin.trim()))
    .filter(origin => origin);
  allowedOrigins.push(...additionalOrigins);
}

export const corsMiddleware = cors({
  origin: function (origin, callback) {
    // In production, require origin validation to prevent CSRF attacks
    // In development, allow no-origin requests for testing with curl/postman
    if (!origin) {
      if (process.env.NODE_ENV === 'production') {
        console.error('CORS: Request with no origin rejected in production');
        return callback(new Error('Origin header is required in production'), false);
      } else {
        console.warn('CORS: Allowing request with no origin in development mode');
        return callback(null, true);
      }
    }

    const normalizedOrigin = normalizeOrigin(origin);
    
    if (allowedOrigins.indexOf(normalizedOrigin) !== -1) {
      console.log(`CORS: Origin ${normalizedOrigin} allowed`);
      callback(null, true);
    } else {
      console.error(`CORS: Origin ${normalizedOrigin} not allowed. Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // Cache preflight requests for 24 hours
});
