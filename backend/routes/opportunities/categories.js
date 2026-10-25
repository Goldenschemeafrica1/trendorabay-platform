import express from 'express';
import { cache } from '../../middleware/cacheMiddleware.js';

const router = express.Router();

// Get all work types
router.get('/work-types', cache(3600), async (req, res, next) => {
  try {
    // Return predefined work types
    const workTypes = [
      'Jobs',
      'Internships',
      'Scholarships',
      'Grants',
      'Fellowships',
      'Competitions',
      'Events',
      'Training',
      'Courses',
      'Volunteering'
    ];
    res.json({ success: true, data: workTypes });
  } catch (error) {
    next(error);
  }
});

// Get all categories (industry/sector categories)
router.get('/categories', cache(3600), async (req, res, next) => {
  try {
    const pool = await import('../../config/database.js').then(m => m.default);
    const [rows] = await pool.query(
      'SELECT DISTINCT category FROM opportunities WHERE category IS NOT NULL AND category != "" ORDER BY category ASC'
    );
    const categories = rows.map(row => row.category);
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

export default router;
