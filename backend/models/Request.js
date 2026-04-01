const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  alumniId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    default: "pending" // pending, accepted, rejected, completed
  },
  message: String,
  meetingLink: String,
  meetingDate: String,
  studentFeedback: String,
  alumniFeedback: String
});

module.exports = mongoose.model("Request", requestSchema);