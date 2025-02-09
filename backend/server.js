const express = require("express");
const mongoose = require("mongoose");
const { OpenAI } = require("openai");
const { MongoClient, ServerApiVersion } = require("mongodb");
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
app.use(express.static("public"));
app.use(authRoutes);
app.use(userRoutes);
app.use("/api/books", bookRoutes);

// Connect to MongoDB
mongoose.connect("mongodb_connection_string/bookify-db");

// Check MongoDB Connection Status
const dbm = mongoose.connection;

dbm.on("connected", () => {
  console.log("MongoDB is connected");
});

dbm.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

dbm.on("disconnected", () => {
  console.log("MongoDB is not connected");
});

// MongoDB Native Driver
const client = new MongoClient("mongodb_connection_string", {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
let db;
async function connectNativeDB() {
  await client.connect();
  db = client.db("bookify-db");
  console.log("Connected to MongoDB via Native Driver");
}
connectNativeDB().catch(console.error);

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: "open_ai_api_key",
});

// AI Query Processing Endpoint
app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;

    // Step 1: Generate MongoDB query using OpenAI
    const systemPrompt = `You are a MongoDB expert. Convert user questions about books into MongoDB queries.
Collection schema: 
- title (string)
- price (number)
- description (string)
- imgLink (string)
- category (string)
- reviews (array)

Respond ONLY with valid JSON in this format: 
{ "operation": "count|find|aggregate", "query": {}, "projection": {} }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
    });

    // Parse the generated query
    const mongoQuery = JSON.parse(completion.choices[0].message.content);

    // Step 2: Execute MongoDB query
    let result;
    const collection = db.collection("books");

    switch (mongoQuery.operation) {
      case "count":
        result = await collection.countDocuments(mongoQuery.query);
        break;
      case "find":
        result = await collection
          .find(mongoQuery.query)
          .project(mongoQuery.projection || {})
          .toArray();
        break;
      case "aggregate":
        result = await collection.aggregate(mongoQuery.query).toArray();
        break;
      default:
        throw new Error("Invalid operation");
    }

    // Step 3: Generate natural language response
    const responsePrompt = `Convert this data into a friendly answer for the question: "${question}"
Data: ${JSON.stringify(result)}`;

    const finalResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: responsePrompt }],
    });

    res.json({ answer: finalResponse.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

// Simple Route for testing
app.get("/", (req, res) => {
  res.send("Backend is running on PORT");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// cUcE9G.zC@PcD-.
