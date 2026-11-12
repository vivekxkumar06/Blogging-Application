import React, { useState, useEffect } from "react";
import { Bookmark, Sparkles, BookOpen } from "lucide-react";
import API from "../services/api";
import { useToast } from "../context/ToastContext";
import BlogCard from "../components/blog/BlogCard";
import { BlogCardSkeleton } from "../components/common/Skeleton";
import EmptyState from "../components/common/EmptyState";

const Bookmarks = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/bookmarks");
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (err) {
      toast.error("Failed to load reading list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleBookmarkChange = (blogId, isBookmarked) => {
    if (!isBookmarked) {
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
          <Bookmark className="w-5 h-5 fill-brand-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Your Reading List
        </h1>
      </div>
      <p className="text-xs sm:text-sm text-slate-500 mb-8 max-w-xl">
        Curated stories and technical references you've bookmarked to read later.
      </p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(3)].map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Your reading list is empty"
          description="Save engaging stories while exploring so you can return to them whenever you're ready."
          actionText="Explore Stories"
          actionLink="/search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onBookmarkChange={handleBookmarkChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
