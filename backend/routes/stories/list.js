import express from 'express';
import { cache } from '../../middleware/cacheMiddleware.js';
import { StoryService } from '../../services/storyService.js';

const router = express.Router();

router.get('/', cache(300), async (req, res, next) => {
  try {
    const filters = {
      category: req.query.category,
      author: req.query.author,
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
      featured: req.query.featured,
      status: req.query.status
    };
    
    const result = await StoryService.getStories(filters);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/search', cache(60), async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    
    const rows = await StoryService.searchStories(q, page, limit);
    
    res.json({ success: true, data: rows || [] });
  } catch (error) {
    next(error);
  }
});

router.get('/latest', cache(300), async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const stories = await StoryService.getLatestStories(limit);
    
    res.json({ success: true, data: stories });
  } catch (error) {
    next(error);
  }
});

router.get('/featured', cache(300), async (req, res, next) => {
  try {
    const story = await StoryService.getFeaturedStory();
    
    if (!story) {
      return res.status(404).json({ success: false, error: 'No featured story found' });
    }
    
    res.json({ success: true, data: story });
  } catch (error) {
    next(error);
  }
});

router.get('/recent', cache(300), async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const stories = await StoryService.getRecentStories(limit);
    
    res.json({ success: true, data: stories });
  } catch (error) {
    next(error);
  }
});

router.get('/popular', cache(300), async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const stories = await StoryService.getPopularStories(limit);
    res.json({ success: true, data: stories });
  } catch (error) {
    next(error);
  }
});

export default router;
