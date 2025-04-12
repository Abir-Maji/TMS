const express = require('express');
const router = express.Router();
const { 
  createTask, 
  getTasks, 
  updateTask, 
  deleteTask,
  completeTask,
  getAdminNotifications,
  markAdminNotificationsRead
} = require('../controllers/taskController');

// Add middleware to log requests for debugging
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.put('/:id/complete', completeTask); // New route
router.get('/admin/notifications', getAdminNotifications); // New route
router.put('/admin/notifications/mark-read', markAdminNotificationsRead); // New route

module.exports = router;