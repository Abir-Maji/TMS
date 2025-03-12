// const express = require('express');
// const router = express.Router();
// const Employee = require('../models/Employee');

// router.post('/register-employee', async (req, res) => {
//   try {
//     const { name, email, phone, team, username, password } = req.body;

//     // Validate input
//     if (!name || !email || !phone || !team || !username || !password) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Check for existing employee
//     const existingEmployee = await Employee.findOne({ $or: [{ email }, { username }] });
//     if (existingEmployee) {
//       return res.status(409).json({ message: 'Employee already exists' });
//     }

//     // Create new employee (No password hashing)
//     const newEmployee = new Employee({
//       name,
//       email,
//       phone,
//       team,
//       username,
//       password,  // ⚠ Storing plain text password (NOT SECURE)
//     });

//     await newEmployee.save();
//     res.status(201).json({ message: 'Employee registered successfully' });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const User = require('../models/User'); // Import User model

router.post('/register-employee', async (req, res) => {
  try {
    const { name, email, phone, team, username, password } = req.body;

    // Validate input
    if (!name || !email || !phone || !team || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if employee or user already exists
    const existingEmployee = await Employee.findOne({ email });
    const existingUser = await User.findOne({ username });

    if (existingEmployee || existingUser) {
      return res.status(409).json({ message: 'Employee or username already exists' });
    }

    // Insert into `employees` collection
    const newEmployee = new Employee({ name, email, phone, team, username, password });
    await newEmployee.save();

    // Insert into `users` collection
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'Employee registered successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
