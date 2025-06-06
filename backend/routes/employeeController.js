const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

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

// Get designation statistics
router.get('/stats/designations', async (req, res) => {
  try {
    const stats = await Employee.aggregate([
      {
        $group: {
          _id: "$designation",
          count: { $sum: 1 },
          teamCount: { $addToSet: "$team" }
        }
      },
      {
        $project: {
          designation: "$_id",
          count: 1,
          teamCount: { $size: "$teamCount" },
          change: { 
            $floor: { 
              $add: [
                { $multiply: [{ $rand: {} }, 10] },
                -2
              ]
            } 
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching designation stats:', error);
    res.status(500).json({ message: 'Failed to fetch designation statistics', error });
  }
});

// Fetch all employees with pagination and filtering
// Update your employees route in employeeController.js
router.get('/employees',  async (req, res) => {
  try {
    const { page = 1, limit = 10, designation, team } = req.query;
    const query = {};
    
    if (designation) query.designation = designation;
    if (team) query.team = team;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      collation: { locale: 'en', strength: 2 } // For case-insensitive sorting
    };

    // Make sure Employee model has paginate plugin
    const employees = await Employee.paginate(query, options);
    
    // Ensure the response format matches what frontend expects
    res.status(200).json({
      docs: employees.docs,
      total: employees.totalDocs,
      limit: employees.limit,
      page: employees.page,
      pages: employees.totalPages
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ 
      message: 'Failed to fetch employees',
      error: error.message // Send only the error message
    });
  }
});

// Get employee by ID
router.get('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employee', error });
  }
});

// Create new employee
router.post('/employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create employee', error });
  }
});

// Update an employee
router.put('/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update employee', error });
  }
});

// Delete an employee
router.delete('/employees/:id',  async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete employee', error });
  }
});

// Update password change endpoint to handle username
router.put('/update-password', async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    
    // Find employee by username
    const employee = await Employee.findOne({ username });
    if (!employee) {
      return res.status(404).json({ 
        success: false,
        message: 'Employee not found' 
      });
    }

    // Simple password comparison (without bcrypt)
    if (currentPassword !== employee.password) {
      return res.status(400).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }

    // Update password (plain text - NOT RECOMMENDED FOR PRODUCTION)
    employee.password = newPassword;
    await employee.save();

    res.json({ 
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});
module.exports = router;