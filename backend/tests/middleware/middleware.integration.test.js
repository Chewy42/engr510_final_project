const request = require('supertest');
const express = require('express');
const { body } = require('express-validator');
const validate = require('../../src/middleware/validation');
const configureSecurityMiddleware = require('../../src/middleware/security');
const { errorHandler, APIError } = require('../../src/middleware/errorHandler');

describe('Middleware Integration Tests', () => {
    let app;
    let server;

    beforeAll(() => {
        app = express();
        configureSecurityMiddleware(app);

        // Test routes
        app.post('/test/validate', 
            validate([
                body('email').isEmail(),
                body('password').isLength({ min: 6 })
            ]),
            (req, res) => {
                res.json({ success: true, data: req.body });
            }
        );

        app.get('/test/error/operational', (req, res, next) => {
            next(new APIError(400, 'Operational Error'));
        });

        app.get('/test/error/programming', (req, res, next) => {
            throw new Error('Programming Error');
        });

        // Add error handler last
        app.use(errorHandler);

        server = app.listen(0); // Random port
    });

    afterAll((done) => {
        server.close(done);
    });

    describe('Security and Rate Limiting', () => {
        test('should apply security headers', async () => {
            const response = await request(app).get('/test/validate');
            expect(response.headers).toHaveProperty('x-dns-prefetch-control');
            expect(response.headers).toHaveProperty('x-frame-options');
        });

        test('should handle CORS', async () => {
            const response = await request(app)
                .options('/test/validate')
                .set('Origin', 'http://localhost:3000');
            expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
        });

        test('should reject oversized payloads', async () => {
            const largeData = 'x'.repeat(11 * 1024 * 1024); // 11MB
            const response = await request(app)
                .post('/test/validate')
                .send({ data: largeData });
            expect(response.status).toBe(413);
        });
    });

    describe('Validation and Error Handling', () => {
        test('should validate input successfully', async () => {
            const response = await request(app)
                .post('/test/validate')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        test('should reject invalid input', async () => {
            const response = await request(app)
                .post('/test/validate')
                .send({
                    email: 'invalid-email',
                    password: '12345'
                });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toHaveLength(2);
        });

        test('should handle operational errors correctly', async () => {
            const response = await request(app)
                .get('/test/error/operational');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe('fail');
            expect(response.body.message).toBe('Operational Error');
        });

        test('should handle programming errors correctly', async () => {
            const originalEnv = process.env.NODE_ENV;
            
            // Test production behavior
            process.env.NODE_ENV = 'production';
            let response = await request(app)
                .get('/test/error/programming');
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Something went wrong');
            expect(response.body).not.toHaveProperty('stack');

            // Test development behavior
            process.env.NODE_ENV = 'development';
            response = await request(app)
                .get('/test/error/programming');
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Programming Error');
            expect(response.body).toHaveProperty('stack');

            process.env.NODE_ENV = originalEnv;
        });
    });

    describe('End-to-End Flow', () => {
        test('should handle multiple middleware in correct order', async () => {
            // This test verifies that security headers are applied before validation
            const response = await request(app)
                .post('/test/validate')
                .set('Origin', 'http://localhost:3000')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            // Check security headers
            expect(response.headers).toHaveProperty('x-dns-prefetch-control');
            expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');

            // Check validation result
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        test('should maintain consistent error format across different types', async () => {
            // Test validation error
            let response = await request(app)
                .post('/test/validate')
                .send({ email: 'invalid' });
            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('errors');

            // Test operational error
            response = await request(app)
                .get('/test/error/operational');
            expect(response.body).toHaveProperty('status');
            expect(response.body).toHaveProperty('message');

            // Test programming error
            response = await request(app)
                .get('/test/error/programming');
            expect(response.body).toHaveProperty('status');
            expect(response.body).toHaveProperty('message');
        });
    });
});
