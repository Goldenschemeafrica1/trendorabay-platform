import express from 'express';
import { StoryService } from '../../services/storyService.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const story = await StoryService.createStory(req.body);
    res.status(201).json({ success: true, data: story });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const story = await StoryService.updateStory(req.params.id, req.body);
    
    if (!story) {
      return res.status(404).json({ success: false, error: 'Story not found' });
    }
    
    res.json({ success: true, data: story });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await StoryService.deleteStory(req.params.id);
    res.json({ success: true, message: 'Story deleted successfully' });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/featured', async (req, res, next) => {
  try {
    const { featured } = req.body;
    const story = await StoryService.toggleFeatured(req.params.id, featured);
    res.json({ success: true, data: story });
  } catch (error) {
    next(error);
  }
});

export default router;
