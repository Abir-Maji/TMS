const express = require('express');
const { 
  createTask, 
  getTasks, 
  updateTask, 
  deleteTask 
} = require('../controllers/taskController');

const router = express.Router();

// POST /api/tasks - Create new task
router.post('/', createTask);

// GET /api/tasks - Get all tasks
router.get('/', getTasks);

// PUT /api/tasks/:id - Update task
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', deleteTask);

module.exports = router;