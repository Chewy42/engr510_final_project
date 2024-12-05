const helmet = require('helmet');
const cors = require('cors');
const express = require('express');

const configureSecurityMiddleware = (app) => {
    // Enable Helmet's security headers
    app.use(helmet());

    // Configure CORS
    const corsOptions = {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        maxAge: 86400 // 24 hours
    };
    app.use(cors(corsOptions));

    // Add rate limiting
    const rateLimit = require('express-rate-limit');
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    });
    app.use('/api/', limiter);

    // Add request size limits
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
};

module.exports = configureSecurityMiddleware;
