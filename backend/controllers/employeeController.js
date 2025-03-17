const Employee = require('../models/Employee');

// Fetch details of a specific employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const employeeId = req.params.id; // Get the employee ID from the request parameters

    // Fetch the employee's details from the database
    const employee = await Employee.findById(employeeId).select('-password'); // Exclude the password
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch details of a specific employee by username
const getEmployeeByUsername = async (req, res) => {
  try {
    const username = req.params.username; // Get the username from the request parameters

    // Fetch the employee's details from the database
    const employee = await Employee.findOne({ username }).select('-password'); // Exclude the password
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEmployeeById,
  getEmployeeByUsername,
};