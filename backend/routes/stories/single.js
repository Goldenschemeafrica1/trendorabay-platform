import express from 'express';
import { cache } from '../../middleware/cacheMiddleware.js';
import { StoryService } from '../../services/storyService.js';

const router = express.Router();

const reservedPaths = ['innovation', 'latest', 'featured', 'recent', 'popular', 'search'];

router.get('/:slug', cache(300), async (req, res, next) => {
  // Skip if this is a reserved path
  if (reservedPaths.includes(req.params.slug)) {
    return next();
  }

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
