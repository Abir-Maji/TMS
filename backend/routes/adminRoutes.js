const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware'); // this now correctly points to a function

router.get('/dashboard', (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  res.status(200).json({ message: 'Welcome to the admin dashboard' });
});
router.post('/admins', adminController.createAdmin);
module.exports = router;
