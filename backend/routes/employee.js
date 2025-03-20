const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Collaborator = require('../models/Collaborator'); // Import Collaborator model

router.post('/register-employee', async (req, res) => {
  try {
    const { name, email, phone, team, username, password } = req.body;

    // Validate input
    if (!name || !email || !phone || !team || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if employee or collaborator already exists
    const existingEmployee = await Employee.findOne({ email });
    const existingCollaborator = await Collaborator.findOne({ username });

    if (existingEmployee || existingCollaborator) {
      return res.status(409).json({ message: 'Employee or collaborator already exists' });
    }

    // Insert into `employees` collection
    const newEmployee = new Employee({ 
      name, 
      email, 
      phone, 
      team, 
      username, 
      password 
    });
    await newEmployee.save();

    // Insert into `collaborators` collection (only username and name)
    const newCollaborator = new Collaborator({ 
      name, 
      username 
      // `message` and `from` will automatically be set to empty strings
    });
    await newCollaborator.save();

    res.status(201).json({ message: 'Employee registered and collaborator added successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;