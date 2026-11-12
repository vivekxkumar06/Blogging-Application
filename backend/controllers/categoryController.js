const Category = require("../models/Category");
const Blog = require("../models/Blog");

// @desc    Get all categories with article counts
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Aggregate counts of published articles per category
    const counts = await Blog.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    counts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });

    const categoriesWithCount = categories.map((cat) => ({
      ...cat.toObject(),
      articleCount: countMap[cat._id.toString()] || 0,
    }));

    res.json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create category (Admin only)
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, image, color } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      description: description || "",
      image:
        image ||
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
      color: color || "#3B82F6",
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
};
