import request from 'supertest';
import app from '../server.js';

describe('Health Check Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/ready', () => {
    it('should return readiness status', async () => {
      const response = await request(app)
        .get('/api/ready')
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('ready');
      // Status can be 200 (ready) or 503 (not ready)
      expect([200, 503]).toContain(response.status);
    });
  });
});
