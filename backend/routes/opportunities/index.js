import express from 'express';
import categoriesRouter from './categories.js';
import listRouter from './list.js';
import crudRouter from './crud.js';

const router = express.Router();

// Mount sub-routers
router.use('/', categoriesRouter);
router.use('/', listRouter);
router.use('/', crudRouter);

export default router;
