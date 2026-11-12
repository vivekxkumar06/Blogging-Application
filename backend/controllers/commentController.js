const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

// @desc    Get comments for a blog post
// @route   GET /api/comments/blog/:blogId
// @access  Public
const getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blog: blogId })
      .populate("user", "name avatar role")
      .sort({ createdAt: -1 });

    // Separate top-level comments and replies
    const topLevelComments = [];
    const repliesMap = {};

    comments.forEach((comment) => {
      if (comment.parentComment) {
        const parentId = comment.parentComment.toString();
        if (!repliesMap[parentId]) {
          repliesMap[parentId] = [];
        }
        repliesMap[parentId].push(comment);
      } else {
        topLevelComments.push(comment);
      }
    });

    const structuredComments = topLevelComments.map((c) => ({
      ...c.toObject(),
      replies: repliesMap[c._id.toString()] || [],
    }));

    res.json({
      success: true,
      comments: structuredComments,
      totalCount: comments.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create comment or reply
// @route   POST /api/comments
// @access  Private
const createComment = async (req, res) => {
  try {
    const { blogId, content, parentCommentId } = req.body;

    if (!blogId || !content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Blog ID and comment content are required",
      });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    const comment = await Comment.create({
      blog: blogId,
      user: req.user._id,
      content: content.trim(),
      parentComment: parentCommentId || null,
    });

    const populated = await Comment.findById(comment._id).populate(
      "user",
      "name avatar role"
    );

    res.status(201).json({
      success: true,
      message: "Comment posted successfully",
      comment: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check ownership or admin
    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment",
      });
    }

    // Also delete any child replies
    await Comment.deleteMany({ parentComment: comment._id });
    await comment.deleteOne();

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle like comment
// @route   POST /api/comments/:id/like
// @access  Private
const toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    const userId = req.user._id;
    const isLiked = comment.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (isLiked) {
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      success: true,
      isLiked: !isLiked,
      likesCount: comment.likes.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCommentsByBlog,
  createComment,
  deleteComment,
  toggleLikeComment,
};
