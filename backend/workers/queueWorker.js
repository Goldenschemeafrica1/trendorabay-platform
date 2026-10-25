import jobQueue from '../config/queue.js';
import logger from '../config/logger.js';

jobQueue.process('email', async (job) => {
  try {
    const { to, subject } = job.data;
    logger.info('Processing email job', { id: job.id, to, subject });
    // Replace with real email transport (SendGrid, AWS SES, etc.)
    await new Promise(resolve => setTimeout(resolve, 200));
    return { sent: true, to };
  } catch (error) {
    logger.error('Email job failed', { id: job.id, error: error.message });
    throw error;
  }
});

jobQueue.process('image-processing', async (job) => {
  try {
    const { filename, transformations } = job.data;
    logger.info('Processing image job', { id: job.id, filename, transformations });
    // Replace with sharp, imagemagick, or cloud processing
    await new Promise(resolve => setTimeout(resolve, 500));
    return { processed: true, filename };
  } catch (error) {
    logger.error('Image processing job failed', { id: job.id, error: error.message });
    throw error;
  }
});

jobQueue.process('heavy-processing', async (job) => {
  try {
    const { task } = job.data;
    logger.info('Processing heavy job', { id: job.id, task });
    // Replace with worker threads or child processes for CPU-heavy work
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { completed: true, task };
  } catch (error) {
    logger.error('Heavy processing job failed', { id: job.id, error: error.message });
    throw error;
  }
});

export const startQueueWorker = () => {
  try {
    console.log('Queue workers started for: email, image-processing, heavy-processing');
  } catch (error) {
    console.error('Failed to start queue workers:', error.message);
    // Don't crash the server if queue workers fail
    console.warn('Server will continue without queue workers');
  }
};
