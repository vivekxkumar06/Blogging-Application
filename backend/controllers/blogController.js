const Blog = require("../models/Blog");
const Category = require("../models/Category");
const Comment = require("../models/Comment");
const Bookmark = require("../models/Bookmark");
const slugify = require("slugify");

// @desc    Get all blogs with filtering, search, pagination, and sorting
// @route   GET /api/blogs
// @access  Public
const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const { search, category, tag, author, status, sort } = req.query;

    const query = { status: status || "published" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (category) {
      const catDoc = await Category.findOne({
        $or: [{ slug: category }, { name: category }],
      });
      if (catDoc) {
        query.category = catDoc._id;
      }
    }

    if (tag) {
      query.tags = { $in: [new RegExp(`^${tag}$`, "i")] };
    }

    if (author) {
      query.author = author;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === "popular") {
      sortOptions = { views: -1, "likes.length": -1 };
    } else if (sort === "trending") {
      sortOptions = { views: -1, createdAt: -1 };
    } else if (sort === "oldest") {
      sortOptions = { createdAt: 1 };
    }

    const totalBlogs = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate("author", "name avatar bio")
      .populate("category", "name slug color")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      blogs,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalBlogs / limit),
        totalBlogs,
        hasMore: page * limit < totalBlogs,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch blogs",
    });
  }
};

// @desc    Get featured articles for hero & showcase
// @route   GET /api/blogs/featured
// @access  Public
const getFeaturedBlogs = async (req, res) => {
  try {
    let blogs = await Blog.find({ status: "published", isFeatured: true })
      .populate("author", "name avatar bio")
      .populate("category", "name slug color")
      .limit(5);

    if (blogs.length === 0) {
      // Fallback to highest view blogs
      blogs = await Blog.find({ status: "published" })
        .populate("author", "name avatar bio")
        .populate("category", "name slug color")
        .sort({ views: -1, createdAt: -1 })
        .limit(5);
    }

    res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get trending articles
// @route   GET /api/blogs/trending
// @access  Public
const getTrendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "published" })
      .populate("author", "name avatar")
      .populate("category", "name slug color")
      .sort({ views: -1, createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single blog by slug or ID
// @route   GET /api/blogs/:slug
// @access  Public (supports optional token)
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({
      $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
    })
      .populate("author", "name avatar bio twitter github linkedin followers")
      .populate("category", "name slug color description");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // Increment view count asynchronously
    blog.views += 1;
    await blog.save();

    let isLiked = false;
    let isBookmarked = false;
    let isFollowingAuthor = false;

    if (req.user) {
      isLiked = blog.likes.some(
        (userId) => userId.toString() === req.user._id.toString()
      );
      const bookmarkExists = await Bookmark.findOne({
        user: req.user._id,
        blog: blog._id,
      });
      isBookmarked = !!bookmarkExists;

      if (blog.author && blog.author.followers) {
        isFollowingAuthor = blog.author.followers.some(
          (u) => u.toString() === req.user._id.toString()
        );
      }
    }

    res.json({
      success: true,
      blog,
      userInteraction: {
        isLiked,
        isBookmarked,
        isFollowingAuthor,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new blog post
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, coverImage, status, isFeatured } =
      req.body;

    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, excerpt, content, and category are required",
      });
    }

    // Find category ID by id or slug
    let categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      categoryDoc = await Category.findOne({ slug: category });
    }
    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid category selected",
      });
    }

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const blog = await Blog.create({
      title,
      excerpt,
      content,
      category: categoryDoc._id,
      tags: parsedTags,
      coverImage:
        coverImage ||
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80",
      status: status || "published",
      isFeatured: req.user.role === "admin" ? !!isFeatured : false,
      author: req.user._id,
    });

    const populatedBlog = await Blog.findById(blog._id)
      .populate("author", "name avatar")
      .populate("category", "name slug color");

    res.status(201).json({
      success: true,
      message: "Blog post published successfully",
      blog: populatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create blog post",
    });
  }
};

// @desc    Update blog post
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Check ownership or admin
    if (
      blog.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own articles",
      });
    }

    const {
      title,
      excerpt,
      content,
      category,
      tags,
      coverImage,
      status,
      isFeatured,
    } = req.body;

    if (title) {
      blog.title = title;
      blog.slug = `${slugify(title, { lower: true, strict: true })}-${blog._id
        .toString()
        .slice(-4)}`;
    }
    if (excerpt) blog.excerpt = excerpt;
    if (content) blog.content = content;
    if (coverImage) blog.coverImage = coverImage;
    if (status) blog.status = status;
    if (category) {
      let cat = await Category.findById(category);
      if (!cat) cat = await Category.findOne({ slug: category });
      if (cat) blog.category = cat._id;
    }
    if (tags) {
      blog.tags = Array.isArray(tags)
        ? tags
        : tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
    if (req.user.role === "admin" && isFeatured !== undefined) {
      blog.isFeatured = isFeatured;
    }

    const updatedBlog = await blog.save();
    const populated = await Blog.findById(updatedBlog._id)
      .populate("author", "name avatar")
      .populate("category", "name slug color");

    res.json({
      success: true,
      message: "Blog post updated successfully",
      blog: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check ownership or admin
    if (
      blog.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this article",
      });
    }

    await Comment.deleteMany({ blog: blog._id });
    await Bookmark.deleteMany({ blog: blog._id });
    await blog.deleteOne();

    res.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle like on blog post
// @route   POST /api/blogs/:id/like
// @access  Private
const toggleLikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const userId = req.user._id;
    const isLiked = blog.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (isLiked) {
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.json({
      success: true,
      isLiked: !isLiked,
      likesCount: blog.likes.length,
      message: isLiked ? "Article unliked" : "Article liked",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get related blogs by category
// @route   GET /api/blogs/:id/related
// @access  Public
const getRelatedBlogs = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const related = await Blog.find({
      category: blog.category,
      _id: { $ne: blog._id },
      status: "published",
    })
      .populate("author", "name avatar")
      .populate("category", "name slug color")
      .limit(3);

    res.json({
      success: true,
      blogs: related,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllBlogs,
  getFeaturedBlogs,
  getTrendingBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLikeBlog,
  getRelatedBlogs,
};
