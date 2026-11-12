import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Globe,
  Twitter,
  Github,
  Linkedin,
  Calendar,
  UserPlus,
  UserCheck,
  Edit3,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import BlogCard from "../components/blog/BlogCard";
import EmptyState from "../components/common/EmptyState";
import Modal from "../components/common/Modal";

const AuthorProfile = () => {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated, updateUserProfile } = useAuth();
  const toast = useToast();

  const [author, setAuthor] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Edit Profile Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    avatar: "",
    website: "",
    twitter: "",
    github: "",
    linkedin: "",
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  const isMe = currentUser?._id === id;

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/users/${id}`);
      if (data.success) {
        setAuthor(data.user);
        setBlogs(data.blogs);
        setIsFollowing(data.user.isFollowing);

        if (isMe) {
          setEditForm({
            name: data.user.name || "",
            bio: data.user.bio || "",
            avatar: data.user.avatar || "",
            website: data.user.website || "",
            twitter: data.user.twitter || "",
            github: data.user.github || "",
            linkedin: data.user.linkedin || "",
          });
        }
      }
    } catch (err) {
      toast.error("Author not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    window.scrollTo(0, 0);
  }, [id]);

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      return toast.info("Please sign in to follow this author");
    }

    try {
      setFollowLoading(true);
      const { data } = await API.post(`/users/${id}/follow`);
      setIsFollowing(data.isFollowing);
      setAuthor((prev) => ({
        ...prev,
        followersCount: data.followersCount,
      }));
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setEditSubmitting(true);
      await updateUserProfile(editForm);
      toast.success("Profile updated successfully!");
      setEditModalOpen(false);
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setEditSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="w-48 h-6 bg-slate-200 rounded" />
            <div className="w-32 h-4 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!author) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-card mb-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <img
            src={author.avatar}
            alt={author.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-soft shrink-0"
          />

          {/* Details */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {author.name}
                </h1>
                {author.role === "admin" && (
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Lead Editorial & Staff
                  </span>
                )}
              </div>

              {/* Action Button */}
              {isMe ? (
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-full transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    isFollowing
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Follow Author</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Bio */}
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              {author.bio || "No biography provided yet."}
            </p>

            {/* Stats row & Socials */}
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span>
                  <strong className="text-slate-900 font-bold">
                    {author.followersCount || 0}
                  </strong>{" "}
                  Followers
                </span>
                <span>•</span>
                <span>
                  <strong className="text-slate-900 font-bold">
                    {author.followingCount || 0}
                  </strong>{" "}
                  Following
                </span>
                <span>•</span>
                <span>
                  <strong className="text-slate-900 font-bold">{blogs.length}</strong>{" "}
                  Articles
                </span>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-2.5">
                {author.website && (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {author.twitter && (
                  <a
                    href={author.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-500 hover:bg-sky-50 transition-colors"
                    title="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {author.github && (
                  <a
                    href={author.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {author.linkedin && (
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Author's Stories Feed */}
      <div>
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            Published Articles ({blogs.length})
          </h2>
          {isMe && (
            <Link
              to="/create"
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              + Write New Story
            </Link>
          )}
        </div>

        {blogs.length === 0 ? (
          <EmptyState
            title="No published articles yet"
            description={`${author.name} hasn't published any stories yet.`}
            actionText={isMe ? "Write your first story" : undefined}
            actionLink={isMe ? "/create" : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Avatar URL
            </label>
            <input
              type="text"
              value={editForm.avatar}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, avatar: e.target.value }))
              }
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Bio
            </label>
            <textarea
              value={editForm.bio}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, bio: e.target.value }))
              }
              rows={3}
              maxLength={300}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Website
              </label>
              <input
                type="url"
                value={editForm.website}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, website: e.target.value }))
                }
                placeholder="https://yourdomain.com"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Twitter URL
              </label>
              <input
                type="url"
                value={editForm.twitter}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, twitter: e.target.value }))
                }
                placeholder="https://twitter.com/handle"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={editForm.github}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, github: e.target.value }))
                }
                placeholder="https://github.com/handle"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={editForm.linkedin}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, linkedin: e.target.value }))
                }
                placeholder="https://linkedin.com/in/handle"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editSubmitting}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full shadow-sm hover:shadow transition-all disabled:opacity-40"
            >
              {editSubmitting ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AuthorProfile;
