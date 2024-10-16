import request from 'supertest';
import { app } from '../src/app';
import { describe, it, expect } from '@jest/globals';

describe('API Routes', () => {

  it('should return more than one student', async () => {
    const response = await request(app).get('/api/estudiantes');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(1);
  });

  it('should return 404', async () => {
    const id = '60f3b3b3b3b3b3b3b3b3b3b3';
    const response = await request(app).get(`/api/estudiantes/${id}`);
    expect(response.status).toBe(404);
  });

});
