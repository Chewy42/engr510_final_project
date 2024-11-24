import request from 'supertest';
import { app } from '../app';
import bcrypt from 'bcrypt';
import { db } from '../db';

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    // Clear users table and add a test user
    await db.run('DELETE FROM users');
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    await db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      ['test@example.com', hashedPassword]
    );
  });

  afterAll(async () => {
    // Clean up
    await db.run('DELETE FROM users');
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate valid user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should create new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'newpassword',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'User created successfully');
    });

    it('should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'anotherpassword',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});
