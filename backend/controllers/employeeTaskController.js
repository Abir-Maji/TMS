const Task = require('../models/Task');
const Employee = require('../models/Employee');

// Fetch all tasks
const getTasks = async (req, res) => {
    const { team } = req.params; // Get the team name from the request params
  
    try {
      // Fetch tasks where team matches the provided team
      const tasks = await Task.find({ team });
  
      res.json({ team, tasks });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Add a new task
const addTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
};

// Fetch tasks for an employee's team
const getTasksByEmployeeTeam = async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Find the employee by ID
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Fetch tasks where team matches the employee's team
    const tasks = await Task.find({ team: employee.team });

    res.json({ employee, tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Export all functions
module.exports = { getTasks, addTask, updateTask, deleteTask, getTasksByEmployeeTeam };