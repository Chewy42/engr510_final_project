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

// Configure security middleware (includes helmet, cors, and rate limiting)
configureSecurityMiddleware(app);

// Parse JSON and URL-encoded bodies with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/analysis', analysisRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;
