// backend/routes/authRoutes.js
const express = require("express");
const User = require("../models/User"); // MongoDB model for users
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password, phone, country, dob } = req.body;
  console.log({ name, email, phone, country, dob });
  try {
    // Parse DOB to a Date object if provided
    const dobAsDate = dob ? new Date(dob) : null;

    // Optional: Calculate age if DOB is provided
    const age = dobAsDate
      ? Math.floor(
          (new Date() - dobAsDate) / (365.25 * 24 * 60 * 60 * 1000)
        )
      : null;

    // Create a new user in MongoDB
    const newUser = new User({
      name,
      email,
      password,
      phone,
      country,
      dob: dobAsDate, // Store DOB in the database
      age, // Include age if required
    });
    
   console.log("New user object:", newUser);
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
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
