const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user (UNSAFE - STORES PLAIN TEXT PASSWORDS)
router.post('/register', async (req, res) => {
  try {
      const { username, password } = req.body;

      if (!username || !password) {
          return res.status(400).json({ message: 'Username and password are required' });
      }

      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(409).json({ message: 'Username already exists' });
      }

      // Save the password in plain text (UNSAFE)
      const newUser = new User({ username, password });

      await newUser.save();

      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route (bcrypt.compare still works with plain text)
router.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body;

      if (!username || !password) {
          return res.status(400).json({ message: 'Username and password are required' });
      }

      const user = await User.findOne({ username });

      if (!user) {
          return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Compare plain text passwords (UNSAFE)
      if (password !== user.password) {
          return res.status(401).json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// Middleware for protected routes
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification failed:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Example protected route
router.get('/protected', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.json({ message: 'Protected route accessed successfully', user });
  } catch (error) {
    console.error('Protected route error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;