const Task = require('../models/Task');

// Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, deadline, priority, team, users, progress } = req.body;

    // Validation
    if (!title || !description || !deadline || !team || !users) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Date validation
    if (new Date(deadline) < new Date()) {
      return res.status(400).json({ message: 'Deadline must be in the future' });
    }

    // Create task with notification flags
    const task = new Task({
      title,
      description,
      deadline,
      priority: priority || 'medium',
      team: team.toUpperCase(),
      users,
      progress: progress || 0,
      isNewNotification: true,
      notificationRead: false
    });

    const savedTask = await task.save();
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: savedTask
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
};

// Get All Tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('users', 'name email');
    res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get Employee Notifications
const getEmployeeNotifications = async (req, res) => {
  try {
    const { team } = req.query; // Changed from req.user to req.query
    
    const notifications = await Task.find({
      team,
      isNewNotification: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// Mark Notification as Read
const markNotificationAsRead = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const task = await Task.findByIdAndUpdate(
      taskId,
      { 
        isNewNotification: false,
        notificationRead: true 
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notification',
      error: error.message
    });
  }
};
const markAllAsRead = async (req, res) => {
  try {
    const { team } = req.body;
    await Task.updateMany(
      { team, isNewNotification: true },
      { $set: { isNewNotification: false } }
    );
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error marking notifications as read',
      error: error.message
    });
  }
};
const completeTask = async (req, res) => {
  try {
    const { username } = req.body; // The user completing the task
    
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        progress: 100,
        isCompleted: true,
        completedBy: username,
        completedAt: new Date(),
        isNewNotification: true // Flag for admin notification
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task marked as complete',
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing task',
      error: error.message
    });
  }
};

// Get admin notifications (completed tasks)
const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Task.find({
      isCompleted: true,
      isNewNotification: true
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin notifications',
      error: error.message
    });
  }
};

// Mark admin notifications as read
const markAdminNotificationsRead = async (req, res) => {
  try {
    await Task.updateMany(
      { isCompleted: true, isNewNotification: true },
      { isNewNotification: false }
    );
    res.status(200).json({
      success: true,
      message: 'Admin notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating admin notifications',
      error: error.message
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getEmployeeNotifications,
  markNotificationAsRead,
  markAllAsRead,
  completeTask,
  getAdminNotifications,
  markAdminNotificationsRead
};