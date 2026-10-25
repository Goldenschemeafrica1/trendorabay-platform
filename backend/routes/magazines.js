import express from 'express';
import router from './magazines/index.js';

const app = express.Router();

// Mount the magazines router
app.use('/', router);

export default app;
