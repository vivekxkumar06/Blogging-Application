const express = require("express");
const {
  getCommentsByBlog,
  createComment,
  deleteComment,
  toggleLikeComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/blog/:blogId", getCommentsByBlog);
router.post("/", protect, createComment);
router.delete("/:id", protect, deleteComment);
router.post("/:id/like", protect, toggleLikeComment);

module.exports = router;
