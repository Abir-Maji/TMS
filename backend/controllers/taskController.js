const Task = require('../models/Task');

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, currentDate, deadline, priority, team, user } = req.body;

    // Validate input data
    if (!title || !description || !currentDate || !deadline || !priority || !team || !user) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new task
    const newTask = new Task({
      title,
      description,
      currentDate,
      deadline,
      priority,
      team,
      user,
    });

    // Save the task to the database
    await newTask.save();

    // Send success response
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'An error occurred while creating the task' });
  }
};

// Get all tasks
const getTasks = async (req, res) => {
    try {
      const tasks = await Task.find();
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'An error occurred while fetching tasks' });
    }
  };
  
  // Delete a task
  const deleteTask = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTask = await Task.findByIdAndDelete(id);
  
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'An error occurred while deleting the task' });
    }
  };
  
  // Update a task
  const updateTask = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, deadline, priority } = req.body;
  
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { title, description, deadline, priority },
        { new: true } // Return the updated task
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'An error occurred while updating the task' });
    }
  };
  

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};