const express = require("express");
const {
  getStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllBlogsAdmin,
  toggleFeatureBlog,
  getAllCommentsAdmin,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

router.get("/blogs", getAllBlogsAdmin);
router.put("/blogs/:id/feature", toggleFeatureBlog);

router.get("/comments", getAllCommentsAdmin);

module.exports = router;
