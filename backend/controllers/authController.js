const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    // Extract ALL fields needed for both student and alumni
    const { 
      name, email, password, role, 
      graduationYear, company, jobRole, skills, mentorshipAreas, availability 
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      graduationYear,
      company,
      jobRole,
      skills: skills ? skills.split(',').map(s => s.trim()) : [],
      mentorshipAreas: mentorshipAreas ? mentorshipAreas.split(',').map(m => m.trim()) : [],
      availability,
    });

    await user.save();

    res.json({ message: "User Registered Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};