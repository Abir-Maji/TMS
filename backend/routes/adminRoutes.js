const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Protected Admin Route
router.get('/dashboard', authMiddleware, (req, res) => {
  if (req.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  res.status(200).json({ message: 'Welcome to the admin dashboard' });
});

module.exports = router;