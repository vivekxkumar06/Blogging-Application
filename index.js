require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

const Blog = require("./models/blog");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blogs");
const {
  checkForAuthenticationCookie,
} = require("./middleware/authentication");

const app = express();
const PORT = process.env.PORT || 8000;

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(checkForAuthenticationCookie("token"));

// Expose user to all views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Serve static files
app.use(express.static(path.resolve("./public")));

// MongoDB connection
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/blogify";
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Home route
app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  } catch (error) {
    console.error("Home route error:", error);
    res.render("home", {
      user: req.user,
      blogs: [],
    });
  }
});

// Routes
app.use("/user", userRoute);
app.use("/blog", blogRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server Started at PORT: ${PORT}`);
});
