const User = require("../models/User");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const Category = require("../models/Category");
const Newsletter = require("../models/Newsletter");

// @desc    Get dashboard analytics & summary stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: "published" });
    const draftBlogs = await Blog.countDocuments({ status: "draft" });
    const totalComments = await Comment.countDocuments();
    const totalSubscribers = await Newsletter.countDocuments();

    // Sum of all views across blogs
    const viewsAggregate = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);
    const totalViews = viewsAggregate[0]?.totalViews || 0;

    // Category distribution
    const categoryDistribution = await Blog.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDoc",
        },
      },
      { $unwind: "$categoryDoc" },
      {
        $project: {
          name: "$categoryDoc.name",
          color: "$categoryDoc.color",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Recent 5 blogs
    const recentBlogs = await Blog.find()
      .populate("author", "name avatar")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 users
    const recentUsers = await User.find()
      .select("name email avatar role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totalComments,
        totalViews,
        totalSubscribers,
      },
      categoryDistribution,
      recentBlogs,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users for admin table
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && role !== "all") {
      query.role = role;
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    const usersWithCounts = await Promise.all(
      users.map(async (u) => {
        const blogCount = await Blog.countDocuments({ author: u._id });
        return {
          ...u.toObject(),
          blogCount,
        };
      })
    );

    res.json({
      success: true,
      users: usersWithCounts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent removing admin role from oneself
    if (user._id.toString() === req.user._id.toString() && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "You cannot revoke your own administrator privileges",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot delete your own account" });
    }

    // Delete user blogs & comments
    await Blog.deleteMany({ author: user._id });
    await Comment.deleteMany({ user: user._id });
    await user.deleteOne();

    res.json({
      success: true,
      message: "User and their data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all blogs for admin table
// @route   GET /api/admin/blogs
// @access  Private/Admin
const getAllBlogsAdmin = async (req, res) => {
  try {
    const { search, status, category } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    const blogs = await Blog.find(query)
      .populate("author", "name email avatar")
      .populate("category", "name slug color")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle feature blog
// @route   PUT /api/admin/blogs/:id/feature
// @access  Private/Admin
const toggleFeatureBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    blog.isFeatured = !blog.isFeatured;
    await blog.save();

    res.json({
      success: true,
      isFeatured: blog.isFeatured,
      message: blog.isFeatured
        ? "Article highlighted as Featured"
        : "Article removed from Featured",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all comments for admin moderation
// @route   GET /api/admin/comments
// @access  Private/Admin
const getAllCommentsAdmin = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user", "name email avatar")
      .populate("blog", "title slug")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllBlogsAdmin,
  toggleFeatureBlog,
  getAllCommentsAdmin,
};
