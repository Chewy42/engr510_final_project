const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const configureSecurityMiddleware = require('./middleware/security');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai.routes');
const projectRoutes = require('./routes/projects');
const analysisRoutes = require('./routes/analysis');

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Configure security middleware (includes helmet, cors, and rate limiting)
configureSecurityMiddleware(app);

// Parse JSON and URL-encoded bodies with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint (before other routes to ensure it's always accessible)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/analysis', analysisRoutes);

// 404 handler
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`,
    path: req.url
  });
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;
