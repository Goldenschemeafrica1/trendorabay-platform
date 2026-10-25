import express from 'express';
import router from './podcasts/index.js';

const app = express.Router();

// Mount the podcasts router
app.use('/', router);

export default app;
