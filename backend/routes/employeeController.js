const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee'); // Assuming you have an Employee model


// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};


// Fetch all employees
router.get('/get-all-employees', async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employees', error });
  }
});


// Update an employee
router.put('/update-employee/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update employee', error });
  }
});

// Delete an employee
router.delete('/delete-employee/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete employee', error });
  }
});

// Password change endpoint (without bcrypt)
router.put('/change-password/:username', authenticate, async (req, res) => {
  try {
    const { username } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Find employee
    const employee = await Employee.findOne({ username });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Verify current password (plain text comparison - NOT RECOMMENDED FOR PRODUCTION)
    if (currentPassword !== employee.password) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password (storing plain text - NOT RECOMMENDED FOR PRODUCTION)
    employee.password = newPassword;
    await employee.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;