const express = require('express');
const Employee = require('../models/Employee');

const router = express.Router();

// GET /api/employee/team - Get all teams
router.get('/team', async (req, res) => {
  try {
    const teams = await Employee.distinct('team');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/employee/team/:team - Get employees by team
router.get('/team/:team', async (req, res) => {
    try {
      const employees = await Employee.find({ 
        team: { $regex: new RegExp(`^${req.params.team}$`, 'i') } 
      }).select('_id name');
      
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;