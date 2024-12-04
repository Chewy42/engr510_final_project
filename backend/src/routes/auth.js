const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = db.prepare('SELECT uid, email, created_at FROM users WHERE uid = ?').get(req.user.uid);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't send the password
    delete user.password;
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hashedPassword);

    // Generate JWT token
    const token = jwt.sign({ uid: result.lastInsertRowid }, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email }); // Log login attempt

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    console.log('User found:', user ? 'yes' : 'no'); // Log if user was found

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch); // Log password match result

    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET);
    console.log('Token generated successfully');

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

module.exports = router;
