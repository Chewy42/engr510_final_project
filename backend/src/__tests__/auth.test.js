const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const db = require('../db/database');

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    // Drop and recreate tables
    db.exec('DROP TABLE IF EXISTS projects');
    db.exec('DROP TABLE IF EXISTS users');
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });

  beforeEach(async () => {
    // Clear users table before each test
    db.exec('DELETE FROM users');
    
    // Add test user
    const hashedPassword = await bcrypt.hash('password', 10);
    db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run('mfavela@chapman.edu', hashedPassword);
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate valid user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'mfavela@chapman.edu',
          password: 'password'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'mfavela@chapman.edu',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@chapman.edu',
          password: 'password'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  afterAll(async () => {
    // Clean up
    db.exec('DROP TABLE IF EXISTS users');
  });
});
