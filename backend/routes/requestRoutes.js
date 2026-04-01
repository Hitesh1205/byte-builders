const express = require("express");
const router = express.Router();
const Request = require("../models/Request");

router.post("/send", async (req, res) => {
  try {
    const { studentId, alumniId, message } = req.body;
    const request = new Request({ studentId, alumniId, message });
    await request.save();
    res.json({ message: "Request Sent Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update status and optionally add meeting details
router.put("/update-status", async (req, res) => {
  try {
    const { requestId, status, meetingLink, meetingDate } = req.body;
    
    let updateData = { status };
    if (meetingLink) updateData.meetingLink = meetingLink;
    if (meetingDate) updateData.meetingDate = meetingDate;

    await Request.findByIdAndUpdate(requestId, updateData);
    res.json({ message: "Request updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit Feedback & Complete Session
router.put("/feedback", async (req, res) => {
  try {
    const { requestId, role, feedback } = req.body;
    
    let updateData = {};
    if (role === "student") updateData.studentFeedback = feedback;
    if (role === "alumni") {
        updateData.alumniFeedback = feedback;
        updateData.status = "completed"; // Alumni marks it completed
    }

    await Request.findByIdAndUpdate(requestId, updateData);
    res.json({ message: "Feedback submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const requests = await Request.find();
  res.json(requests);
});

router.get("/alumni/:alumniId", async (req, res) => {
  try {
    const requests = await Request.find({ alumniId: req.params.alumniId })
      .populate("studentId", "name email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/student/:studentId", async (req, res) => {
  try {
    const requests = await Request.find({ studentId: req.params.studentId })
      .populate("alumniId", "name email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;