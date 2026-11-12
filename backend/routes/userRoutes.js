const express = require("express");
const {
  getUserProfile,
  toggleFollow,
  getRecommendedAuthors,
} = require("../controllers/userController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/authors/recommended", getRecommendedAuthors);
router.get("/:id", optionalAuth, getUserProfile);
router.post("/:id/follow", protect, toggleFollow);

module.exports = router;
