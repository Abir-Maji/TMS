// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model
const hashPassword = require('../utils/hashPassword'); // Import your password hashing utility

// Registration route
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await hashPassword(password); // Hash the password
        if (!hashedPassword) {
            return res.status(500).json({ message: 'Password hashing failed' });
        }

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials - User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1h', // Token expiration
            });
            res.json({ token });
        } else {
            return res.status(401).json({ message: 'Invalid credentials - Password mismatch' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Protected route example (requires JWT authentication)
router.get('/protected', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        res.json({ message: 'Protected route accessed successfully', user });
    } catch (error) {
        console.error('Protected route error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;