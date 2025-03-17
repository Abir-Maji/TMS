const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  currentDate: { type: String, required: true },
  deadline: { type: String, required: true },
  priority: { type: String, required: true },
  team: { type: String, required: true },
  user: { type: String, required: true },
  progress: { type: Number, required: true, default: 0 }, // Add progress field
});

module.exports = mongoose.model('Task', taskSchema);