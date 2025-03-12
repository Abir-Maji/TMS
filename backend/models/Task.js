const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  currentDate: { type: String, required: true },
  deadline: { type: String, required: true },
  priority: { type: String, required: true },
  groupName: { type: String, required: true },
  user: { type: String, required: true },
});

module.exports = mongoose.model('Task', taskSchema);