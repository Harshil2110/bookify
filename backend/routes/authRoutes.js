// backend/routes/authRoutes.js
const express = require("express");
const User = require("../models/User"); // MongoDB model for users
const router = express.Router();

// Create a new user with role
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Create a new user in MongoDB with the specified role
    const newUser = new User({
      name,
      email,
      password, // Either 'customer' or 'worker'
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

router.get("/user-role/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json({ user: { _id: user._id, email: user.email } });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user role", error });
  }
});

module.exports = router;
