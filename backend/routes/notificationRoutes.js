// notificationRoutes.js
const express = require('express');
const router = express.Router();
const {
  getEmployeeNotifications,
  markNotificationAsRead,
  markAllAsRead
} = require('../controllers/taskController');

router.get('/', getEmployeeNotifications);
router.put('/:taskId/read', markNotificationAsRead);
router.put('/mark-all-read', markAllAsRead);

module.exports = router;