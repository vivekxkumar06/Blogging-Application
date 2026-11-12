const User = require("../models/User");
const Blog = require("../models/Blog");

// @desc    Get user profile by ID with their articles
// @route   GET /api/users/:id
// @access  Public (optional auth)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "name avatar")
      .populate("following", "name avatar");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const blogs = await Blog.find({ author: user._id, status: "published" })
      .populate("category", "name slug color")
      .sort({ createdAt: -1 });

    let isFollowing = false;
    if (req.user) {
      isFollowing = user.followers.some(
        (f) => f._id.toString() === req.user._id.toString()
      );
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        website: user.website,
        twitter: user.twitter,
        github: user.github,
        linkedin: user.linkedin,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        isFollowing,
        createdAt: user.createdAt,
      },
      blogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Follow or unfollow an author
// @route   POST /api/users/:id/follow
// @access  Private
const toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId.toString() === currentUserId.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isAlreadyFollowing = targetUser.followers.some(
      (id) => id.toString() === currentUserId.toString()
    );

    if (isAlreadyFollowing) {
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId.toString()
      );
    } else {
      targetUser.followers.push(currentUserId);
      currentUser.following.push(targetUserId);
    }

    await targetUser.save();
    await currentUser.save();

    res.json({
      success: true,
      isFollowing: !isAlreadyFollowing,
      followersCount: targetUser.followers.length,
      message: isAlreadyFollowing ? "Unfollowed author" : "Followed author",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recommended authors for sidebar / home
// @route   GET /api/users/authors/recommended
// @access  Public
const getRecommendedAuthors = async (req, res) => {
  try {
    // Find users with role admin or who have authored blogs
    const authors = await User.find()
      .select("name avatar bio followers role")
      .limit(6);

    const authorsWithCount = await Promise.all(
      authors.map(async (author) => {
        const articleCount = await Blog.countDocuments({
          author: author._id,
          status: "published",
        });
        return {
          _id: author._id,
          name: author.name,
          avatar: author.avatar,
          bio: author.bio,
          role: author.role,
          followersCount: author.followers.length,
          articleCount,
        };
      })
    );

    res.json({
      success: true,
      authors: authorsWithCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserProfile,
  toggleFollow,
  getRecommendedAuthors,
};
