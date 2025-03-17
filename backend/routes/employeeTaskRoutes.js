const express = require('express');
const { getTasksByEmployeeTeam } = require('../controllers/employeeTaskController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the employee is authenticated

const router = express.Router();

// GET /api/employee/tasks - Fetch tasks for the logged-in employee's team
router.get('/', authMiddleware, getTasksByEmployeeTeam);

module.exports = router;