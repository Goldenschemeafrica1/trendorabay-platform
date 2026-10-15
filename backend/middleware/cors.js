import cors from 'cors';

// Normalize origin by removing trailing slashes and ensuring consistent format
const normalizeOrigin = (origin) => {
  if (!origin) return origin;
  return origin.replace(/\/$/, '');
};

// Build allowed origins list from environment and hardcoded values
const allowedOrigins = [
  normalizeOrigin(process.env.FRONTEND_URL || 'http://localhost:5173'),
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'https://trendorabay-platform-j5j0e39eq-golden-scheme-africa-s-projects.vercel.app',
  'https://trendorabay-platform-qn53sqsys-golden-scheme-africa-s-projects.vercel.app',
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
    // Allow requests without origin header (same-origin requests, health checks, monitoring)
    if (!origin) {
      console.warn('CORS: Allowing request with no origin');
      return callback(null, true);
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
