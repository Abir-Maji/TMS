const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Fetch tasks for the specified team
router.get('/tasks', async (req, res) => {
  try {
    const { team } = req.query; // Get the team from the query parameters

    if (!team) {
      return res.status(400).json({ message: 'Team is required' });
    }

    // Fetch tasks for the specified team
    const tasks = await Task.find({ team: team.trim() });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this team' });
    }

    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/update-progress/:taskId', async (req, res) => {
  try {
      const { taskId } = req.params;
      const { progress } = req.body;

      if (!progress || progress < 0 || progress > 100) {
          return res.status(400).json({ message: 'Progress must be between 0 and 100' });
      }

      const task = await Task.findByIdAndUpdate(taskId, { progress }, { new: true });

      if (!task) {
          return res.status(404).json({ message: 'Task not found' });
      }

      res.json({ message: 'Progress updated successfully', task });
  } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;