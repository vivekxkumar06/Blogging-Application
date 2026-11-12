const Bookmark = require("../models/Bookmark");
const Blog = require("../models/Blog");

// @desc    Toggle bookmark for current user
// @route   POST /api/bookmarks/:blogId
// @access  Private
const toggleBookmark = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const existingBookmark = await Bookmark.findOne({
      user: userId,
      blog: blogId,
    });

    if (existingBookmark) {
      await existingBookmark.deleteOne();
      return res.json({
        success: true,
        isBookmarked: false,
        message: "Removed from reading list",
      });
    } else {
      await Bookmark.create({
        user: userId,
        blog: blogId,
      });
      return res.json({
        success: true,
        isBookmarked: true,
        message: "Saved to reading list",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookmarked articles for logged in user
// @route   GET /api/bookmarks
// @access  Private
const getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: "blog",
        populate: [
          { path: "author", select: "name avatar bio" },
          { path: "category", select: "name slug color" },
        ],
      })
      .sort({ createdAt: -1 });

    const validBookmarks = bookmarks
      .filter((b) => b.blog !== null && b.blog.status === "published")
      .map((b) => b.blog);

    res.json({
      success: true,
      count: validBookmarks.length,
      blogs: validBookmarks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  toggleBookmark,
  getMyBookmarks,
};
