require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Connect MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"].filter(Boolean),
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Local uploads support
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BuildNotes Backend is running successfully!",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "BuildNotes MERN Blog API",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Local development server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`[BuildNotes Server running on port ${PORT}]`);
  });
}

// Export Express app for Vercel
module.exports = app;
