const express = require("express");
const {
  getAllBlogs,
  getFeaturedBlogs,
  getTrendingBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLikeBlog,
  getRelatedBlogs,
} = require("../controllers/blogController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/featured", getFeaturedBlogs);
router.get("/trending", getTrendingBlogs);
router.get("/:slug", optionalAuth, getBlogBySlug);
router.get("/:id/related", getRelatedBlogs);

router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);
router.post("/:id/like", protect, toggleLikeBlog);

module.exports = router;
