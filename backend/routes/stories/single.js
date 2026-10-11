import express from 'express';
import { cache } from '../../middleware/cacheMiddleware.js';
import { StoryService } from '../../services/storyService.js';

const router = express.Router();

router.get('/:slug', cache(300), async (req, res, next) => {
  try {
    console.log('Fetching story with slug:', req.params.slug);
    const story = await StoryService.getStoryByIdOrId(req.params.slug);

    console.log('Story found:', !!story);
    if (story) {
      console.log('Story ID:', story.id, 'Story slug:', story.slug);
    }

    if (!story) {
      return res.status(404).json({ success: false, error: 'Story not found' });
    }

    res.json({ success: true, data: story });
  } catch (error) {
    console.error('Error fetching story:', error);
    next(error);
  }
});

export default router;
