const express = require('express');
const { 
  createTask, 
  getTasks, 
  updateTask, 
  deleteTask 
} = require('../controllers/taskController');

const router = express.Router();

// Add middleware to log requests for debugging
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;