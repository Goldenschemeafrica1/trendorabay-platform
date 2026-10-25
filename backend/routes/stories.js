import express from 'express';
import homepageRoutes from './stories/homepage.js';
import listRoutes from './stories/list.js';
import singleRoutes from './stories/single.js';
import crudRoutes from './stories/crud.js';
import interactionRoutes from './stories/interactions.js';

const router = express.Router();

// Homepage endpoint
router.use('/homepage', homepageRoutes);

// List and search endpoints (must be before single story route to avoid conflicts)
router.use('/', listRoutes);

// Single story endpoint (must be after specific list routes)
router.use('/', singleRoutes);

// CRUD operations
router.use('/', crudRoutes);

// Interaction endpoints (likes, comments, shares, views)
router.use('/', interactionRoutes);

export default router;
