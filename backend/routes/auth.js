const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');
const MongoStore = require('connect-mongo'); // Add this import

// Session-based Registration
router.post('/register-employee', async (req, res) => {
  try {
    const { name, email, phone, team, username, password } = req.body;

    if (!name || !email || !phone || !team || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingEmployeeByEmail = await Employee.findOne({ email });
    const existingEmployeeByUsername = await Employee.findOne({ username });

    if (existingEmployeeByEmail) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    if (existingEmployeeByUsername) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const newEmployee = new Employee({ name, email, phone, team, username, password });
    await newEmployee.save();

    res.status(201).json({ message: 'Employee registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Session-based Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      if (!username || !password) {
          return res.status(400).json({ 
              success: false,
              message: 'Username and password are required' 
          });
      }

      const employee = await Employee.findOne({ username });
      
      if (!employee || password !== employee.password) {
          return res.status(401).json({ 
              success: false,
              message: 'Invalid credentials'
          });
      }

      // Store user in session
      req.session.user = {
          _id: employee._id,
          username: employee.username,
          role: employee.role,
          team: employee.team,
          name: employee.name
      };

      res.status(200).json({ 
          success: true,
          message: 'Login successful',
          user: {
              _id: employee._id,
              username: employee.username,
              role: employee.role,
              team: employee.team,
              name: employee.name
          }
      });

  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
          success: false,
          message: 'An error occurred during login' 
      });
  }
});
// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username });

    if (!admin || password !== admin.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Store admin in session
    req.session.user = {
      _id: admin._id,
      username: admin.username,
      role: 'admin'
    };
    req.session.cookie.httpOnly = true;
    req.session.cookie.secure = process.env.NODE_ENV === 'production';
    req.session.cookie.sameSite = 'lax';
    res.json({ 
      success: true,
      message: 'Admin login successful',
      user: req.session.user
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Session-based Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    
    res.clearCookie('connect.sid', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    res.json({ success: true });
  });
});

// Session Authentication Middleware
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Protected Routes
router.get('/protected-route', requireAuth, async (req, res) => {
  try {
    const user = await Employee.findById(req.session.user._id).select('-password');
    res.json({ message: 'Protected route accessed', user });
  } catch (error) {
    console.error('Protected route error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/admin/protected', requireAuth, requireAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.session.user._id).select('-password');
    res.json({ message: 'Admin protected route accessed', admin });
  } catch (error) {
    console.error('Admin route error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Session Check Endpoint
router.get('/check-session', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(200).json({ 
        authenticated: false 
      });
    }

    res.status(200).json({
      authenticated: true,
      role: req.session.user.role,
      user: {
        _id: req.session.user._id,
        username: req.session.user.username
      }
    });
  } catch (error) {
    console.error('Session check error:', error);
    res.status(500).json({ 
      error: 'Session check failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;