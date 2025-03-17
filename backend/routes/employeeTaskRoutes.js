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

module.exports = router;