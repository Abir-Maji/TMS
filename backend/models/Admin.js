const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store plain text password (not recommended for production)
});

// Compare password (simple string comparison)
adminSchema.methods.comparePassword = function (candidatePassword) {
  return this.password === candidatePassword;
};

module.exports = mongoose.model('Admin', adminSchema);