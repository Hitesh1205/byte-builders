const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const alumni = await User.find({ role: "alumni" });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;