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
    const user = db.prepare('SELECT uid, email, created_at FROM users WHERE uid = ?').get(req.user.uid);
    
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

    // Generate JWT token
    const token = jwt.sign({ uid: result.lastInsertRowid }, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', validate(loginValidation), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email }); // Log login attempt

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    console.log('User found:', user ? 'yes' : 'no'); // Log if user was found

    if (!user) {
      console.log('User not found');
      throw new APIError(401, 'Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch); // Log password match result

    if (!isMatch) {
      console.log('Password mismatch');
      throw new APIError(401, 'Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET);
    console.log('Token generated successfully');

    res.json({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
