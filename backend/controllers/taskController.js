const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    const { title, description, deadline, priority, team, users, progress } = req.body;

    // Validation
    if (!title || !description || !deadline || !team || !users?.length) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Date validation
    if (new Date(deadline) < new Date()) {
      return res.status(400).json({ message: 'Deadline must be in the future' });
    }

    // Create task
    const task = new Task({
      title,
      description,
      deadline,
      priority: priority || 'medium',
      team: team.toUpperCase(),
      users,
      progress: progress || 0
    });

    await task.save();
    res.status(201).json(task);

  } catch (error) {
    console.error('Error creating task:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('users', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};