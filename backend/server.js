const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
app.use(
  cors({
    origin: "*", // Replace with your frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(authRoutes);
app.use(userRoutes);
app.use("/api/books", bookRoutes);

// Connect to MongoDB
mongoose.connect("url_to_your_database/bookify-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Simple Route for testing
app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
