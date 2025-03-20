const express = require("express");
const router = express.Router();
const Collaborator = require("../models/Collaborator");

// Fetch all collaborators
router.get("/", async (req, res) => {
  try {
    const collaborators = await Collaborator.find();
    res.json(collaborators);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ FIXED UPDATE ROUTE (Remove "collaborators/" in the path)
router.put("/:id", async (req, res) => {
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
