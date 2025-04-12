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
  users: { type: String, required: true },
  progress: { 
    type: Number, 
    required: true, 
    min: 0,
    max: 100,
    default: 0 
  },
  isNewNotification: { type: Boolean, default: true },
  notificationRead: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false }, // New field
  completedBy: { type: String }, // New field
  completedAt: { type: Date }, // New field
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);