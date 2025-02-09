const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
    required: true, // Make phone required
  },
  country: { type: String },
  dob: { type: Date },
  age: {
    type: Number,
    min: 0, // Optional: Add constraints for age
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
