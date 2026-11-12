import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Heart, Eye, Clock } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const BlogCard = ({ blog, onBookmarkChange }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const formattedDate = blog?.createdAt
    ? format(new Date(blog.createdAt), "MMM d, yyyy")
    : "Recently";

  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Please sign in to save articles to your reading list");
      return navigate("/login");
    }

    try {
      setBookmarkLoading(true);
      const { data } = await API.post(`/bookmarks/${blog._id}`);
      setIsBookmarked(data.isBookmarked);
      toast.success(data.message);
      if (onBookmarkChange) onBookmarkChange(blog._id, data.isBookmarked);
    } catch (err) {
      toast.error("Failed to update bookmark");
    } finally {
      setBookmarkLoading(false);
    }
  };

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/70 hover:border-slate-300 p-4 sm:p-5 shadow-card hover:shadow-soft transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* Thumbnail & Category Badge */}
        <Link
          to={`/blog/${blog.slug || blog._id}`}
          className="block relative overflow-hidden rounded-xl aspect-[16/9] mb-4 bg-slate-100"
        >
          <img
            src={blog.coverImage}
            alt={blog.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {blog.category && (
            <span
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-sm backdrop-blur-md"
              style={{ backgroundColor: blog.category.color || "#0c8ee9" }}
            >
              {blog.category.name}
            </span>
          )}
        </Link>

        {/* Author info & Reading time */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Link
            to={`/profile/${blog.author?._id}`}
            className="flex items-center gap-2 group/author"
          >
            <img
              src={blog.author?.avatar}
              alt={blog.author?.name}
              className="w-6 h-6 rounded-full object-cover border border-slate-200"
            />
            <span className="text-xs font-medium text-slate-700 group-hover/author:text-brand-600 transition-colors truncate max-w-[120px]">
              {blog.author?.name}
            </span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 shrink-0">
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {blog.readingTime || 3}m
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 mb-2 leading-snug">
          <Link to={`/blog/${blog.slug || blog._id}`}>{blog.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {blog.excerpt}
        </p>
      </div>

      {/* Footer bar: Tags & Engagement */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1 hover:text-slate-600 transition-colors">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
            {blog.likes?.length || 0}
          </span>
          <span className="flex items-center gap-1 hover:text-slate-600 transition-colors">
            <Eye className="w-3.5 h-3.5" />
            {blog.views || 0}
          </span>
        </div>

        {/* Bookmark Action */}
        <button
          onClick={handleBookmarkClick}
          disabled={bookmarkLoading}
          aria-label="Bookmark article"
          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
        >
          <Bookmark
            className={`w-4 h-4 ${
              isBookmarked ? "text-brand-600 fill-brand-600" : ""
            }`}
          />
        </button>
      </div>
    </article>
  );
};

export default BlogCard;
