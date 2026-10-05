import express from 'express';
import { cache } from '../../middleware/cacheMiddleware.js';
import { StoryService } from '../../services/storyService.js';

const router = express.Router();

router.get('/:slug', cache(300), async (req, res, next) => {
  try {
    const story = await StoryService.getStoryByIdOrId(req.params.slug);
    
    if (!story) {
      return res.status(404).json({ success: false, error: 'Story not found' });
    }

    res.json({ success: true, data: story });
  } catch (error) {
    next(error);
  }
});

export default router;
