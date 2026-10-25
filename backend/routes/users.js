import express from 'express';
import authRoutes from './users/auth.js';
import profileRoutes from './users/profile.js';
import passwordRoutes from './users/password.js';
import activityRoutes from './users/activity.js';

const router = express.Router();

router.use('/', authRoutes);
router.use('/', profileRoutes);
router.use('/', passwordRoutes);
router.use('/', activityRoutes);

export default router;
