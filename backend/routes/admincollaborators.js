const express = require("express");
const router = express.Router();
const Collaborator = require("../models/Collaborator");

// Fetch all collaborators (Admin only)
router.get("/collaborators", async (req, res) => {
  try {
    const collaborators = await Collaborator.find();
    res.json(collaborators);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update collaborator by ID (Admin only)
router.put("/collaborators/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    // Update message
    const updatedCollaborator = await Collaborator.findByIdAndUpdate(
      id,
      { message },
      { new: true }
    );

    if (!updatedCollaborator) {
      return res.status(404).json({ message: "Collaborator not found" });
    }

    res.json(updatedCollaborator);
  } catch (error) {
    console.error("Error updating collaborator:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;