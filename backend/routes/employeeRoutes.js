const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Task = require('../models/Task');

// Fetch employee details by username
router.get('/:username', async (req, res) => {
  try {
    const employee = await Employee.findOne({ username: req.params.username });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Fetch tasks for the specified team
router.get('/tasks/by-team', async (req, res) => {
  try {
    const { team } = req.query;

    if (!team) {
      return res.status(400).json({ message: 'Team is required' });
    }

    const tasks = await Task.find({ team: team.trim() })
      .sort({ deadline: 1 }); // Sort by deadline ascending

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this team' });
    }

    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update task progress
router.put('/tasks/update-progress/:taskId', async (req, res) => {
  try {
    const { progress } = req.body;
    const newProgress = Math.min(100, Math.max(0, parseInt(progress) || 0));

    const updateData = { 
      progress: newProgress,
      status: newProgress === 100 ? 'completed' : 'in-progress'
    };
    
    if (newProgress === 100) {
      updateData.completedAt = new Date();
    }

    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      updateData,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ 
      message: 'Progress updated successfully',
      task 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating task progress',
      error: error.message 
    });
  }
});

// Mark task as completed
// Mark task as completed
router.put('/tasks/complete/:taskId', async (req, res) => {
  try {
    console.log('Received complete request for task:', req.params.taskId); // Debug log
    
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        progress: 100,
        status: 'completed',
        completedAt: new Date()
      },
      { new: true }
    );

    console.log('Updated task in DB:', task); // Debug log

    if (!task) {
      console.log('Task not found:', req.params.taskId); // Debug log
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ 
      message: 'Task marked as completed successfully',
      task 
    });
  } catch (error) {
    console.error('Error in completion endpoint:', error); // Debug log
    res.status(500).json({ 
      message: 'Error completing task',
      error: error.message 
    });
  }
});



module.exports = router;