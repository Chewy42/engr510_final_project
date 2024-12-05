const express = require('express');
const request = require('supertest');
const configureSecurityMiddleware = require('../../src/middleware/security');

describe('Security Middleware', () => {
    let app;

    beforeEach(() => {
        app = express();
        configureSecurityMiddleware(app);
        
        // Add a test route
        app.get('/test', (req, res) => {
            res.json({ message: 'success' });
        });
    });

    test('should set security headers', async () => {
        const response = await request(app)
            .get('/test');

        // Verify Helmet headers
        expect(response.headers).toHaveProperty('x-dns-prefetch-control');
        expect(response.headers).toHaveProperty('x-frame-options');
        expect(response.headers).toHaveProperty('x-download-options');
        expect(response.headers).toHaveProperty('x-content-type-options');
        expect(response.headers).toHaveProperty('x-xss-protection');
    });

    test('should handle CORS', async () => {
        const response = await request(app)
            .options('/test')
            .set('Origin', 'http://localhost:3000');

        expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
        expect(response.headers['access-control-allow-methods']).toContain('GET');
        expect(response.headers['access-control-allow-headers']).toContain('Content-Type');
        expect(response.headers['access-control-allow-headers']).toContain('Authorization');
    });

    test('should limit request size', async () => {
        const largeData = 'x'.repeat(11 * 1024 * 1024); // 11MB

        const response = await request(app)
            .post('/test')
            .send({ data: largeData });

        expect(response.status).toBe(413); // Payload Too Large
    });

    test('should apply rate limiting', async () => {
        // Make multiple requests quickly
        const requests = Array(101).fill().map(() =>
            request(app).get('/api/test')
        );

        const responses = await Promise.all(requests);
        
        // At least one request should be rate limited
        const rateLimited = responses.some(res => res.status === 429);
        expect(rateLimited).toBe(true);
    });
});
