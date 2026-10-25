import express from 'express';
import router from './opportunities/index.js';

const app = express.Router();

// Mount the opportunities router
app.use('/', router);

export default app;
