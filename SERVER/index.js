require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectToDB } = require("./Utils/database");
const bodyParser = require("body-parser");
const authRouter = require("./Routes/auth-routes");
const bookRouter = require("./Routes/book-routes");
const readingListRouter = require("./Routes/readingList-routes");
const dashboardRouter = require("./Routes/dashboard-routes");

const PORT = process.env.PORT || 3000;

if (!process.env.DB_URI || !process.env.JWT_SECRET_KEY) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const app = express();
// Middleware 
app.use(cors());
app.use(bodyParser.json());

// API routes
app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);
app.use("/api/reading-lists", readingListRouter);
app.use("/api/dashboard", dashboardRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BookNook API is running",
    timestamp: new Date().toISOString(),
  });
});

// Handle 404 for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Connect to database and start server
connectToDB()
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 BookNook API server running on port ${PORT}`);
      console.log(`📚 API endpoints available at http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err.message);
    process.exit(1);
  });
