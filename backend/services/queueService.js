import jobQueue from '../config/queue.js';

export const sendEmail = (data, opts = {}) =>
  jobQueue.add('email', data, { attempts: 3, backoff: 5000, ...opts });

export const processImage = (data, opts = {}) =>
  jobQueue.add('image-processing', data, { attempts: 2, backoff: 10000, ...opts });

export const runHeavyTask = (data, opts = {}) =>
  jobQueue.add('heavy-processing', data, { attempts: 2, backoff: 10000, ...opts });

export const enqueueJob = (name, data, opts = {}) =>
  jobQueue.add(name, data, opts);
