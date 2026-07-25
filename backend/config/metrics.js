import logger from './logger.js';
import { getRedisStats } from './redis.js';

const SLOW_QUERY_MS = parseInt(process.env.DB_SLOW_QUERY_MS) || 500;
const SLOW_REQUEST_MS = parseInt(process.env.SLOW_REQUEST_MS) || 1000;

const metrics = {
  requests: {
    total: 0,
    byStatus: {},
    durationBuckets: { '<50ms': 0, '<200ms': 0, '<500ms': 0, '<1000ms': 0, '>=1000ms': 0 },
    totalDuration: 0,
    slowCount: 0
  },
  db: {
    totalQueries: 0,
    totalDuration: 0,
    slowQueries: [],
    byType: {}
  },
  cache: {
    hits: 0,
    misses: 0
  }
};

function bucketLabel(duration) {
  if (duration < 50) return '<50ms';
  if (duration < 200) return '<200ms';
  if (duration < 500) return '<500ms';
  if (duration < 1000) return '<1000ms';
  return '>=1000ms';
}

function sqlType(sqlInput) {
  const sql = typeof sqlInput === 'string' ? sqlInput : (sqlInput?.sql || '');
  const match = sql.trim().match(/^\w+/);
  return match ? match[0].toUpperCase() : 'UNKNOWN';
}

export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = String(res.statusCode);
    metrics.requests.total++;
    metrics.requests.byStatus[status] = (metrics.requests.byStatus[status] || 0) + 1;
    metrics.requests.durationBuckets[bucketLabel(duration)]++;
    metrics.requests.totalDuration += duration;
    if (duration >= SLOW_REQUEST_MS) {
      metrics.requests.slowCount++;
      logger.warn('Slow request', { method: req.method, path: req.path, status, duration });
    }
  });
  next();
};

export const recordDbQuery = (sql, duration) => {
  const type = sqlType(sql);
  metrics.db.totalQueries++;
  metrics.db.totalDuration += duration;
  metrics.db.byType[type] = (metrics.db.byType[type] || 0) + 1;

  if (duration >= SLOW_QUERY_MS) {
    const text = typeof sql === 'string' ? sql : (sql?.sql || '');
    const truncated = text.trim().slice(0, 200);
    const entry = { sql: truncated, duration, timestamp: new Date().toISOString() };
    metrics.db.slowQueries.unshift(entry);
    if (metrics.db.slowQueries.length > 20) metrics.db.slowQueries.pop();
    logger.warn('Slow database query', { type, duration, sql: truncated });
  }
};

export const recordCacheHit = () => {
  metrics.cache.hits++;
};

export const recordCacheMiss = () => {
  metrics.cache.misses++;
};

export const getMetrics = async () => {
  const redis = await getRedisStats();
  const cacheTotal = metrics.cache.hits + metrics.cache.misses;
  return {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    requests: {
      ...metrics.requests,
      averageDuration: metrics.requests.total ? Math.round(metrics.requests.totalDuration / metrics.requests.total) : 0
    },
    db: {
      ...metrics.db,
      averageDuration: metrics.db.totalQueries ? Math.round(metrics.db.totalDuration / metrics.db.totalQueries) : 0
    },
    cache: {
      ...metrics.cache,
      hitRate: cacheTotal ? Number((metrics.cache.hits / cacheTotal).toFixed(4)) : 0
    },
    redis
  };
};
