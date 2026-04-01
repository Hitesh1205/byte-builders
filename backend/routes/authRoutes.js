const express = require("express");
const router = express.Router();

const {
  register,
  login
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected profile accessed",
    userId: req.user.id
  });
});

router.post("/register", register);
router.post("/login", login);

module.exports = router;