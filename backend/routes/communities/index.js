import express from 'express';
import listRouter from './list.js';
import membersRouter from './members.js';
import crudRouter from './crud.js';

const router = express.Router();

// Mount sub-routers
router.use('/', listRouter);
router.use('/', membersRouter);
router.use('/', crudRouter);

export default router;
