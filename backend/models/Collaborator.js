const mongoose = require('mongoose');

const CollaboratorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true }, // Ensure username is unique
  message: { type: String }, // Remove default value to avoid duplicates
  // from: { type: String, default: "Admin" }, // Keep default value if needed
});

module.exports = mongoose.model('Collaborator', CollaboratorSchema);
