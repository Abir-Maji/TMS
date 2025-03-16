const express = require('express');
const { getTasks, addTask, updateTask, deleteTask, getTasksByEmployeeTeam } = require('../controllers/employeeTaskController');

const router = express.Router();

// GET /employee/tasks - Fetch all tasks
router.get('/', getTasks);

// POST /employee/tasks - Add a new task
router.post('/', addTask);

// GET /employee/tasks/:employeeId - Fetch tasks for an employee's team
router.get('/:employeeId', getTasksByEmployeeTeam);

// PUT /employee/tasks/:id - Update a task
router.put('/:id', updateTask);

// DELETE /employee/tasks/:id - Delete a task
router.delete('/:id', deleteTask);

module.exports = router;