const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
// const User = require('../models/User');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');

// Register a new user (UNSAFE - STORES PLAIN TEXT PASSWORDS)
router.post('/register-employee', async (req, res) => {
  try {
    const { name, email, phone, team, username, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !team || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email or username already exists
    const existingEmployeeByEmail = await Employee.findOne({ email });
    const existingEmployeeByUsername = await Employee.findOne({ username });

    if (existingEmployeeByEmail) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    if (existingEmployeeByUsername) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Create a new employee
    const newEmployee = new Employee({
      name,
      email,
      phone,
      team,
      username,
      password, // Storing password as plain text (NOT RECOMMENDED)
    });

    // Save the employee to the database
    await newEmployee.save();

    res.status(201).json({ message: 'Employee registered successfully' });
  } catch (error) {
    console.error('Employee registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route (plain text password comparison)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find the employee by username
    const employee = await Employee.findOne({ username });

    if (!employee) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare plain text passwords (UNSAFE - use bcrypt in production)
    if (password !== employee.password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: employee._id,
        username: employee.username,
        role: employee.role,
        team: employee.team, // Include the team in the token payload
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return the token and employee data (excluding the password)
    const employeeData = { ...employee.toObject() };
    delete employeeData.password; // Remove the password from the response
    res.json({ token, employee: employeeData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin Login route (plain text password comparison)
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare plain text passwords (UNSAFE)
    if (password !== admin.password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware for protected routes
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification failed:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Example protected route
router.get('/protected', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.json({ message: 'Protected route accessed successfully', user });
  } catch (error) {
    console.error('Protected route error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Example admin protected route
router.get('/admin/protected', authenticateJWT, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const admin = await Admin.findById(req.user.userId).select('-password');
    if (!admin) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.json({ message: 'Admin protected route accessed successfully', admin });
  } catch (error) {
    console.error('Admin protected route error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;