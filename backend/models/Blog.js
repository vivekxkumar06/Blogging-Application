const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt/description is required"],
      maxlength: [400, "Excerpt cannot exceed 400 characters"],
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    coverImage: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80",
    },
    coverImagePublicId: {
      type: String,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    readingTime: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug and calculate reading time
blogSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${randomSuffix}`;
  }

  if (this.content) {
    // Strip HTML tags for word count estimate
    const plainText = this.content.replace(/<[^>]+>/g, " ");
    const words = plainText.trim().split(/\s+/).filter(Boolean).length;
    this.readingTime = Math.max(1, Math.ceil(words / 200));
  }

  next();
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
