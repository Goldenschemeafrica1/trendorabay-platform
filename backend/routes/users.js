import express from 'express';
import authRoutes from './users/auth.js';
import profileRoutes from './users/profile.js';
import passwordRoutes from './users/password.js';

const router = express.Router();

router.use('/', authRoutes);
router.use('/', profileRoutes);
router.use('/', passwordRoutes);

export default router;
