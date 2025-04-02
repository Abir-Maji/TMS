const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    const { title, description, deadline, priority, team, users, progress } = req.body;

    // Validation (users is now a string)
    if (!title || !description || !deadline || !team || !users) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Date validation
    if (new Date(deadline) < new Date()) {
      return res.status(400).json({ message: 'Deadline must be in the future' });
    }

    // Create task with string users
    const task = new Task({
      title,
      description,
      deadline,
      priority: priority || 'medium',
      team: team.toUpperCase(),
      users, // This should be a string of comma-separated names
      progress: progress || 0
    });

    const savedTask = await task.save();
    console.log('Task saved successfully:', savedTask);
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: savedTask
    });

  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
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