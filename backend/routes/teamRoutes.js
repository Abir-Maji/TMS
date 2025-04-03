const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Get all team members for a specific team
router.get('/:team', async (req, res) => {
  try {
    const { team } = req.params;
    
    if (!team) {
      return res.status(400).json({ 
        success: false,
        message: 'Team parameter is required'
      });
    }

    const teamMembers = await Employee.find({ team })
      .select('-password -__v -createdAt -updatedAt');
    
    res.status(200).json({
      success: true,
      count: teamMembers.length,
      data: teamMembers
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;