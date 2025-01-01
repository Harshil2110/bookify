// backend/routes/userRoutes.js
const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Fetch user details by userId
router.get("/user-details/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId); // Fetch user from MongoDB
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details", error });
  }
});

// Route to fetch user by email
router.get("/user-by-email/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

module.exports = router;
