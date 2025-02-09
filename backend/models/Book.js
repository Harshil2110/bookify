const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewerName: { type: String, required: true },
  reviewText: { type: String, required: true },
  // Optionally, you can add rating, date, etc.
  date: { type: Date, default: Date.now },
});

const bookSchema = new mongoose.Schema({
  imgLink: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reviews: [reviewSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Book", bookSchema);
