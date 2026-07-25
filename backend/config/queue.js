import Queue from 'bull';

const redisUrl = process.env.REDIS_URL || process.env.QUEUE_REDIS_URL || 'redis://localhost:6379';

const jobQueue = new Queue('trendorabay-jobs', redisUrl);

jobQueue.on('error', (err) => {
  console.error('Queue error:', err.message);
});

jobQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed`, result);
});

jobQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed`, err.message);
});

export default jobQueue;
