const express = require("express");
const {
  toggleBookmark,
  getMyBookmarks,
} = require("../controllers/bookmarkController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMyBookmarks);
router.post("/:blogId", protect, toggleBookmark);

module.exports = router;
