import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, UserPlus, UserCheck, Sparkles } from "lucide-react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const AuthorsSection = ({ authors, onFollowChange }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [followingMap, setFollowingMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

  const handleFollowToggle = async (authorId) => {
    if (!isAuthenticated) {
      toast.info("Please sign in to follow authors");
      return navigate("/login");
    }

    try {
      setLoadingMap((prev) => ({ ...prev, [authorId]: true }));
      const { data } = await API.post(`/users/${authorId}/follow`);
      setFollowingMap((prev) => ({
        ...prev,
        [authorId]: data.isFollowing,
      }));
      toast.success(data.message);
      if (onFollowChange) onFollowChange(authorId, data.isFollowing);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update follow status");
    } finally {
      setLoadingMap((prev) => ({ ...prev, [authorId]: false }));
    }
  };

  if (!authors || authors.length === 0) return null;

  return (
    <section className="my-14 pt-10 border-t border-slate-200/80">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Recommended Engineering Voices
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Follow tech leads, systems architects, and prolific creators.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => {
          const isMe = user?._id === author._id;
          const isFollowing = followingMap[author._id];
          const isLoading = loadingMap[author._id];

          return (
            <div
              key={author._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card hover:shadow-soft transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-3">
                  <Link to={`/profile/${author._id}`}>
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/profile/${author._id}`}
                      className="text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors block truncate"
                    >
                      {author.name}
                    </Link>
                    <span className="text-xs text-slate-400">
                      {author.articleCount || 0} articles published
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {author.bio || "Writer and software engineer on BuildNotes."}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {author.followersCount + (isFollowing ? 1 : 0)} followers
                </span>

                {!isMe && (
                  <button
                    onClick={() => handleFollowToggle(author._id)}
                    disabled={isLoading}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isFollowing
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-xs"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AuthorsSection;
