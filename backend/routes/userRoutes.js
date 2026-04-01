const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Request = require("../models/Request");

// Get all alumni
router.get("/alumni", async (req, res) => {
  try {
    const alumni = await User.find({ role: "alumni" });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user account & clean up their requests
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. Delete the user
    await User.findByIdAndDelete(userId);

    // 2. Delete all mentorship requests connected to this user
    await Request.deleteMany({ 
      $or: [{ studentId: userId }, { alumniId: userId }] 
    });

    res.json({ message: "Account and associated data deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;