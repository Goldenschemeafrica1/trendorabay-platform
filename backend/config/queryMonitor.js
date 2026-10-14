import { recordDbQuery } from './metrics.js';

// Query performance monitoring
class QueryMonitor {
  constructor() {
    this.slowQueryThreshold = 1000; // 1 second
    this.queryStats = new Map();
    this.slowQueries = [];
    this.maxSlowQueries = 100;
  }

  // Track query execution
  trackQuery(sql, duration) {
    const queryType = this.getQueryType(sql);
    const normalizedSql = this.normalizeQuery(sql);

    // Update stats
    if (!this.queryStats.has(normalizedSql)) {
      this.queryStats.set(normalizedSql, {
        count: 0,
        totalDuration: 0,
        maxDuration: 0,
        minDuration: Infinity,
        avgDuration: 0,
        type: queryType
      });
    }

    const stats = this.queryStats.get(normalizedSql);
    stats.count++;
    stats.totalDuration += duration;
    stats.maxDuration = Math.max(stats.maxDuration, duration);
    stats.minDuration = Math.min(stats.minDuration, duration);
    stats.avgDuration = stats.totalDuration / stats.count;

    // Track slow queries
    if (duration > this.slowQueryThreshold) {
      this.slowQueries.push({
        sql: sql.substring(0, 500), // Truncate long queries
        duration,
        timestamp: new Date().toISOString(),
        type: queryType
      });

      // Keep only the most recent slow queries
      if (this.slowQueries.length > this.maxSlowQueries) {
        this.slowQueries.shift();
      }

      console.warn(`[SLOW QUERY] ${duration}ms - ${queryType}: ${sql.substring(0, 100)}...`);
    }
  }

  // Get query type (SELECT, INSERT, UPDATE, DELETE, etc.)
  getQueryType(sql) {
    const match = sql.trim().match(/^(\w+)/i);
    return match ? match[1].toUpperCase() : 'UNKNOWN';
  }

  // Normalize query for grouping (remove specific values)
  normalizeQuery(sql) {
    return sql
      .replace(/\d+/g, '?') // Replace numbers with ?
      .replace(/'[^']*'/g, '?') // Replace strings with ?
      .replace(/"[^"]*"/g, '?') // Replace double-quoted strings with ?
      .replace(/`[^`]*`/g, '?') // Replace backtick-quoted identifiers with ?
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  // Sanitize SQL for public display (remove sensitive data)
  sanitizeSql(sql) {
    return sql
      .replace(/password\s*=\s*'[^']*'/gi, 'password=***') // Hide passwords
      .replace(/token\s*=\s*'[^']*'/gi, 'token=***') // Hide tokens
      .replace(/secret\s*=\s*'[^']*'/gi, 'secret=***') // Hide secrets
      .replace(/api_key\s*=\s*'[^']*'/gi, 'api_key=***') // Hide API keys
      .replace(/'[^']*'/g, '?') // Replace all string literals with ?
      .replace(/"[^"]*"/g, '?') // Replace all double-quoted strings with ?
      .substring(0, 200); // Truncate to 200 chars
  }

  // Get performance report (sanitized for public display)
  getReport() {
    const sortedQueries = Array.from(this.queryStats.entries())
      .sort((a, b) => b[1].avgDuration - a[1].avgDuration)
      .slice(0, 20); // Top 20 slowest queries

    return {
      summary: {
        totalQueries: Array.from(this.queryStats.values()).reduce((sum, s) => sum + s.count, 0),
        totalDuration: Array.from(this.queryStats.values()).reduce((sum, s) => sum + s.totalDuration, 0),
        avgDuration: 0,
        slowQueryCount: this.slowQueries.length
      },
      topSlowQueries: sortedQueries.map(([sql, stats]) => ({
        sql: this.sanitizeSql(sql), // Sanitize before returning
        count: stats.count,
        avgDuration: Math.round(stats.avgDuration),
        maxDuration: Math.round(stats.maxDuration),
        type: stats.type
      })),
      recentSlowQueries: this.slowQueries.slice(-10).map(q => ({
        sql: this.sanitizeSql(q.sql), // Sanitize before returning
        duration: q.duration,
        timestamp: q.timestamp,
        type: q.type
      }))
    };
  }

  // Reset stats
  reset() {
    this.queryStats.clear();
    this.slowQueries = [];
  }

  // Log report to console
  logReport() {
    const report = this.getReport();
    console.log('\n=== Query Performance Report ===');
    console.log(`Total Queries: ${report.summary.totalQueries}`);
    console.log(`Total Duration: ${Math.round(report.summary.totalDuration)}ms`);
    console.log(`Slow Queries (>${this.slowQueryThreshold}ms): ${report.summary.slowQueryCount}`);
    console.log('\nTop 20 Slowest Queries (by avg duration):');
    report.topSlowQueries.forEach((q, i) => {
      console.log(`\n${i + 1}. ${q.type} - Avg: ${q.avgDuration}ms, Max: ${q.maxDuration}ms, Count: ${q.count}`);
      console.log(`   ${q.sql}...`);
    });
    console.log('\n==============================\n');
  }
}

// Singleton instance
const queryMonitor = new QueryMonitor();

// Patch recordDbQuery to track queries
const originalRecordDbQuery = recordDbQuery;
export const recordDbQueryWithMonitoring = (sql, duration) => {
  originalRecordDbQuery(sql, duration);
  queryMonitor.trackQuery(sql, duration);
};

export { queryMonitor };
export default queryMonitor;
