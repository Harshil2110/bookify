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

router.get("/second-hand", async (req, res) => {
  try {
    // Fetch books where category is "second-hand"
    const books = await Book.find(
      { category: "second-hand" },
      "_id imgLink title price description"
    );

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found in the 'second-hand' category" });
    }

    res.status(200).json(books); // Respond with filtered book details
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});

router.get("/sci-fi", async (req, res) => {
  try {
    // Fetch books where category is "second-hand"
    const books = await Book.find(
      { category: "sci-fi" },
      "_id imgLink title price description"
    );

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found in the 'second-hand' category" });
    }

    res.status(200).json(books); // Respond with filtered book details
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});

router.get("/suspense", async (req, res) => {
  try {
    // Fetch books where category is "second-hand"
    const books = await Book.find(
      { category: "suspense" },
      "_id imgLink title price description"
    );

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found in the 'second-hand' category" });
    }

    res.status(200).json(books); // Respond with filtered book details
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});

router.get("/thriller", async (req, res) => {
  try {
    // Fetch books where category is "second-hand"
    const books = await Book.find(
      { category: "thriller" },
      "_id imgLink title price description"
    );

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found in the 'second-hand' category" });
    }

    res.status(200).json(books); // Respond with filtered book details
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/reviews", async (req, res) => {
  const { reviewText, reviewerName } = req.body;
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Create new review object
    const review = { reviewerName, reviewText };
    // Push the new review into the reviews array
    book.reviews.push(review);
    await book.save();

    // Return the newly added review (or the whole updated book)
    res.status(201).json({ review });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
