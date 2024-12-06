const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const { registerValidation, loginValidation } = require('../validators/auth.validator');
const { APIError } = require('../middleware/errorHandler');

const router = express.Router();

// Get current user
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?').get(req.user.id);
    
    if (!user) {
      throw new APIError(404, 'User not found');
    }

    // Don't send the password
    delete user.password;
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Register new user
router.post('/register', validate(registerValidation), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      throw new APIError(400, 'Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hashedPassword);

    // Generate JWT token with id instead of uid
    const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', validate(loginValidation), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      throw new APIError(401, 'Invalid email or password');
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new APIError(401, 'Invalid email or password');
    }

    // Generate JWT token with id instead of uid
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
