require('dotenv').config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.route.js");
const postRoutes = require("./routes/post.route.js");
const { errorMiddleware } = require("./middleware/error.middleware.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/uploads", express.static("uploads"));

// 404 handler - must come before error middleware
app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.statusCode = 404;
  next(error);
});

// Global error handler - must be last
app.use(errorMiddleware);

module.exports = app;