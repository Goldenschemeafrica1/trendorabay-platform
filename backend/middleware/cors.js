import cors from 'cors';

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://trendorabay-platform-j5j0e39eq-golden-scheme-africa-s-projects.vercel.app',
  'https://trendorabay-platform.vercel.app',
  'https://trendorabay.com',
  'https://www.trendorabay.com'
];

export const corsMiddleware = cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
