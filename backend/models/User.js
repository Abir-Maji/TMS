const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  team: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ⚠ Plain text password (Not recommended)
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);