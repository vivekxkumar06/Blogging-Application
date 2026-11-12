import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Bookmark,
  Share2,
  Clock,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  UserCheck,
  Calendar,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { DetailsSkeleton } from "../components/common/Skeleton";
import CommentSection from "../components/blog/CommentSection";
import ShareModal from "../components/blog/ShareModal";
import BlogCard from "../components/blog/BlogCard";

const BlogDetails = () => {
  const { slug } = useParams();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/blogs/${slug}`);
        if (data.success && data.blog) {
          setBlog(data.blog);
          setIsLiked(data.userInteraction?.isLiked || false);
          setLikesCount(data.blog.likes?.length || 0);
          setIsBookmarked(data.userInteraction?.isBookmarked || false);
          setIsFollowing(data.userInteraction?.isFollowingAuthor || false);

          // Fetch related articles
          if (data.blog._id) {
            const relRes = await API.get(`/blogs/${data.blog._id}/related`);
            if (relRes.data.success) {
              setRelatedBlogs(relRes.data.blogs);
            }
          }
        }
      } catch (err) {
        toast.error("Article not found or removed");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      toast.info("Sign in to like this story");
      return navigate("/login");
    }

    try {
      setLikeLoading(true);
      const { data } = await API.post(`/blogs/${blog._id}/like`);
      setIsLiked(data.isLiked);
      setLikesCount(data.likesCount);
      toast.success(data.message);
    } catch (err) {
      toast.error("Failed to update like");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      toast.info("Sign in to save this story");
      return navigate("/login");
    }

    try {
      setBookmarkLoading(true);
      const { data } = await API.post(`/bookmarks/${blog._id}`);
      setIsBookmarked(data.isBookmarked);
      toast.success(data.message);
    } catch (err) {
      toast.error("Failed to update bookmark");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      toast.info("Sign in to follow authors");
      return navigate("/login");
    }

    try {
      setFollowLoading(true);
      const { data } = await API.post(`/users/${blog.author?._id}/follow`);
      setIsFollowing(data.isFollowing);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleDeleteArticle = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this article?")) {
      return;
    }

    try {
      const { data } = await API.delete(`/blogs/${blog._id}`);
      toast.success(data.message);
      navigate("/");
    } catch (err) {
      toast.error("Failed to delete article");
    }
  };

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (!blog) {
    return null;
  }

  const isOwner = user?._id === blog.author?._id;
  const canEdit = isOwner || isAdmin;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Link>
      </div>

      {/* Category Pill & Reading Time */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        {blog.category && (
          <span
            className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs"
            style={{ backgroundColor: blog.category.color || "#0c8ee9" }}
          >
            {blog.category.name}
          </span>
        )}
        <span className="text-xs text-slate-400">•</span>
        <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {blog.readingTime || 4} min read
        </span>
        <span className="text-xs text-slate-400">•</span>
        <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          {blog.views} views
        </span>
      </div>

      {/* Article Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-4">
        {blog.title}
      </h1>

      {/* Excerpt / Subtitle */}
      <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-serif italic mb-8">
        {blog.excerpt}
      </p>

      {/* Author Card & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200/80 mb-8">
        <div className="flex items-center gap-3.5">
          <Link to={`/profile/${blog.author?._id}`}>
            <img
              src={blog.author?.avatar}
              alt={blog.author?.name}
              className="w-12 h-12 rounded-full object-cover border border-slate-200"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${blog.author?._id}`}
                className="text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors"
              >
                {blog.author?.name}
              </Link>
              {!isOwner && isAuthenticated && (
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full transition-colors ${
                    isFollowing
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-brand-50 text-brand-700 hover:bg-brand-100"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              Published on{" "}
              {blog.createdAt
                ? format(new Date(blog.createdAt), "MMMM d, yyyy")
                : "Recently"}
            </p>
          </div>
        </div>

        {/* Action Buttons: Like, Bookmark, Share, Edit */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleLikeToggle}
            disabled={likeLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isLiked
                ? "bg-rose-50 border-rose-200 text-rose-600"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
            title="Like this story"
          >
            <Heart
              className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`}
            />
            <span>{likesCount}</span>
          </button>

          <button
            onClick={handleBookmarkToggle}
            disabled={bookmarkLoading}
            className={`p-2 rounded-full border transition-all ${
              isBookmarked
                ? "bg-brand-50 border-brand-200 text-brand-600"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
            title="Save article"
          >
            <Bookmark
              className={`w-4 h-4 ${
                isBookmarked ? "fill-brand-600 text-brand-600" : ""
              }`}
            />
          </button>

          <button
            onClick={() => setShareModalOpen(true)}
            className="p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all"
            title="Share story"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {canEdit && (
            <div className="flex items-center gap-1 pl-2 border-l border-slate-200 ml-1">
              <Link
                to={`/edit/${blog._id}`}
                className="p-2 text-slate-600 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Edit Story"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                onClick={handleDeleteArticle}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Delete Story"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Featured Cover Image */}
      {blog.coverImage && (
        <div className="mb-10 overflow-hidden rounded-3xl shadow-card bg-slate-100 aspect-[16/9] max-h-[500px]">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Rich Editorial Body */}
      <div
        className="editorial-content mb-12"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="pt-6 pb-8 border-t border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Topics Mentioned
          </p>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, i) => (
              <Link
                key={i}
                to={`/search?tag=${encodeURIComponent(tag)}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio Card */}
      {blog.author && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 my-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <Link to={`/profile/${blog.author._id}`}>
            <img
              src={blog.author.avatar}
              alt={blog.author.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
            />
          </Link>
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Written by {blog.author.name}
                </h4>
                <p className="text-xs text-slate-400">
                  {blog.author.followers?.length || 0} followers
                </p>
              </div>
              <Link
                to={`/profile/${blog.author._id}`}
                className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-full shadow-xs transition-colors"
              >
                View Profile
              </Link>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {blog.author.bio ||
                "Writer and software engineer sharing technical ideas on BuildNotes."}
            </p>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <CommentSection blogId={blog._id} />

      {/* Related Stories */}
      {relatedBlogs && relatedBlogs.length > 0 && (
        <section className="mt-16 pt-10 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-xl font-bold text-slate-900">
              Related Articles
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBlogs.map((rel) => (
              <BlogCard key={rel._id} blog={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={blog.title}
        url={window.location.href}
      />
    </article>
  );
};

export default BlogDetails;
