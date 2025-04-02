const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  currentDate: { type: Date, default: Date.now },
  deadline: { type: Date, required: true },
  priority: { 
    type: String, 
    required: true,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  team: { type: String, required: true },
  users: { type: String, required: true }, // Instead of array // Changed to string
  progress: { 
    type: Number, 
    required: true, 
    min: 0,
    max: 100,
    default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);