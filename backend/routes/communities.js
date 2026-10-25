import express from 'express';
import router from './communities/index.js';

const app = express.Router();

// Mount the communities router
app.use('/', router);

export default app;
