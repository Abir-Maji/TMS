const Task = require('../models/Task');

// Controller function to fetch tasks by employee's team
const getTasksByEmployeeTeam = async (req, res) => {
  try {
    const team = req.team; // Get the team from the request object (added by authMiddleware)

    // Fetch tasks for the employee's team
    const tasks = await Task.find({ team: team });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasksByEmployeeTeam,
};