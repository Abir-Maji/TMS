const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Fetch employee details by username
router.get('/:username', async (req, res) => {
  try {
    const employee = await Employee.findOne({ username: req.params.username });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;