const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Get messages for a team
router.get('/:team', async (req, res) => {
  try {
    const messages = await Message.find({ team: req.params.team })
      .sort({ createdAt: 1 })
      .populate('sender', 'name');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;