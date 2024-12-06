const helmet = require('helmet');
const cors = require('cors');
const express = require('express');

const configureSecurityMiddleware = (app) => {
    // Enable Helmet's security headers with development-friendly config
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
    }));

    // Configure CORS for development
    const corsOptions = {
        origin: true, // Allow all origins in development
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        credentials: true,
        maxAge: 86400 // 24 hours
    };
    app.use(cors(corsOptions));

    // Add rate limiting
    const rateLimit = require('express-rate-limit');
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000 // Increased limit for development
    });
    app.use('/api/', limiter);

    // Add request size limits
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
};

module.exports = configureSecurityMiddleware;
