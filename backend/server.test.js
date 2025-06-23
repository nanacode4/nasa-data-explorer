const request = require('supertest');
const app = require('./server'); 

describe('NASA API routes', () => {
  test('GET /api/health returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('GET /api/apod without date returns data', async () => {
    const res = await request(app).get('/api/apod');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('url');
  });

  test('GET /api/neo without start_date returns 400', async () => {
    const res = await request(app).get('/api/neo');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /api/neo with valid date returns object', async () => {
    const res = await request(app).get('/api/neo?start_date=2024-06-01');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('near_earth_objects');
  });

  test('GET /api/library without q returns 400', async () => {
    const res = await request(app).get('/api/library');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
