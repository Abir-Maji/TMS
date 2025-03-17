const express = require('express');
const { getEmployeeById, getEmployeeByUsername } = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/employee/:id - Fetch employee details by ID
router.get('/:id', authMiddleware, getEmployeeById);

// GET /api/employee/username/:username - Fetch employee details by username
router.get('/username/:username', authMiddleware, getEmployeeByUsername);

module.exports = router;