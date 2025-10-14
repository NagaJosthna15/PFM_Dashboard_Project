import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock database connection
jest.mock('../config/database.js', () => ({
  default: jest.fn()
}));

jest.mock('../models/User.js', () => ({
  findOne: jest.fn(),
  prototype: {
    save: jest.fn()
  }
}));

describe('Authentication Routes', () => {
  test('POST /api/auth/register should validate required fields', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser'
        // missing email and password
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('All fields are required');
  });

  test('POST /api/auth/login should validate required fields', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username_or_email: 'testuser'
        // missing password
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username/email and password are required');
  });
});