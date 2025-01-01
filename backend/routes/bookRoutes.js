// backend/routes/bookRoutes.js

const express = require("express");
const Book = require("../models/Book"); // Import the Book model

const router = express.Router();

// Route to fetch all books
router.get("/books", async (req, res) => {
  try {
    // Fetch books from MongoDB and select specific fields
    const books = await Book.find({}, "_id imgLink title price description");
    if (books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }
    res.status(200).json(books); // Respond with book details
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});

module.exports = router;
