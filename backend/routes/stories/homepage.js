import express from 'express';
import { cache } from '../../middleware/cacheMiddleware.js';
import { StoryService } from '../../services/storyService.js';

const router = express.Router();

router.get('/', cache(300), async (req, res, next) => {
  try {
    const status = req.query.status || 'published';
    const data = await StoryService.getHomepageStories(status);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
});

export default router;
