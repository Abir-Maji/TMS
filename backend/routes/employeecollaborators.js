const express = require('express');
const router = express.Router();
const Collaborator = require('../models/Collaborator');

router.get('/collaborators', async (req, res) => {
    const { username } = req.query;
    console.log('Fetching collaborators for username:', username);
  
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
  
    try {
      const collaborators = await Collaborator.find({
        username: { $regex: new RegExp(`^${username.trim()}$`, 'i') }
      });
      console.log('Found collaborators:', collaborators);
  
      if (!collaborators || collaborators.length === 0) {
        return res.status(404).json({ message: 'No collaborators found with that username.' });
      }
  
      res.json(collaborators); // Return an array of collaborators
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
  
  module.exports = router;