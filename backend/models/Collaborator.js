const mongoose = require('mongoose');

const CollaboratorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  message: { type: String, default: null }, // Change from "" to null
  from: { type: String, default: null }
});

module.exports = mongoose.model('Collaborator', CollaboratorSchema);
