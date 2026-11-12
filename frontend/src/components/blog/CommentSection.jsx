import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Heart, Trash2, CornerDownRight, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const CommentSection = ({ blogId }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const toast = useToast();

  const [comments, setComments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Active reply input state: commentId
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const fetchComments = async () => {
    try {
      const { data } = await API.get(`/comments/blog/${blogId}`);
      if (data.success) {
        setComments(data.comments);
        setTotalCount(data.totalCount);
      }
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!isAuthenticated) {
      return toast.info("Please sign in to leave a comment");
    }

    try {
      setSubmitting(true);
      const { data } = await API.post("/comments", {
        blogId,
        content: newComment.trim(),
      });
      if (data.success) {
        toast.success("Comment posted!");
        setNewComment("");
        fetchComments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostReply = async (parentCommentId) => {
    if (!replyContent.trim()) return;

    try {
      setSubmitting(true);
      const { data } = await API.post("/comments", {
        blogId,
        content: replyContent.trim(),
        parentCommentId,
      });
      if (data.success) {
        toast.success("Reply posted!");
        setReplyContent("");
        setActiveReplyId(null);
        fetchComments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const { data } = await API.delete(`/comments/${commentId}`);
      if (data.success) {
        toast.success("Comment removed");
        fetchComments();
      }
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  const handleToggleLike = async (commentId) => {
    if (!isAuthenticated) {
      return toast.info("Please sign in to like comments");
    }

    try {
      await API.post(`/comments/${commentId}/like`);
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="pt-10 mt-10 border-t border-slate-200">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare className="w-5 h-5 text-slate-700" />
        <h3 className="text-xl font-bold text-slate-900">
          Responses ({totalCount})
        </h3>
      </div>

      {/* Main Comment Input Box */}
      {isAuthenticated ? (
        <form onSubmit={handlePostComment} className="mb-10">
          <div className="flex items-start gap-3">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 mt-1"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What are your thoughts on this story?"
                rows={3}
                required
                className="w-full p-3.5 bg-white text-slate-800 placeholder-slate-400 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all text-sm outline-none resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? "Posting..." : "Respond"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center mb-10">
          <p className="text-sm text-slate-600 mb-3">
            Sign in to join the conversation and share your perspectives.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all"
          >
            Sign in to comment
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-20 bg-slate-100 rounded-xl" />
            <div className="h-20 bg-slate-100 rounded-xl" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-slate-400 italic text-center py-6">
            No responses yet. Be the first to spark the discussion!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card"
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <Link to={`/profile/${comment.user?._id}`}>
                    <img
                      src={comment.user?.avatar}
                      alt={comment.user?.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                  </Link>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/profile/${comment.user?._id}`}
                        className="text-sm font-bold text-slate-800 hover:text-brand-600 transition-colors"
                      >
                        {comment.user?.name}
                      </Link>
                      {comment.user?.role === "admin" && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-indigo-50 text-indigo-700">
                          Staff
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">
                      {comment.createdAt
                        ? formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })
                        : "Just now"}
                    </span>
                  </div>
                </div>

                {/* Actions: delete */}
                {(user?._id === comment.user?._id || isAdmin) && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
                    title="Delete comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Comment Content */}
              <p className="text-sm text-slate-700 leading-relaxed pl-10 mb-3">
                {comment.content}
              </p>

              {/* Comment Footer: Likes & Reply Button */}
              <div className="flex items-center gap-4 pl-10 text-xs text-slate-500">
                <button
                  onClick={() => handleToggleLike(comment._id)}
                  className="flex items-center gap-1 hover:text-rose-500 transition-colors"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      comment.likes?.includes(user?._id)
                        ? "text-rose-500 fill-rose-500"
                        : ""
                    }`}
                  />
                  <span>{comment.likes?.length || 0}</span>
                </button>

                {isAuthenticated && (
                  <button
                    onClick={() =>
                      setActiveReplyId(
                        activeReplyId === comment._id ? null : comment._id
                      )
                    }
                    className="flex items-center gap-1 hover:text-slate-800 font-medium transition-colors"
                  >
                    <CornerDownRight className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                )}
              </div>

              {/* Reply Form */}
              {activeReplyId === comment._id && (
                <div className="mt-4 pl-10 flex gap-2">
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <button
                    onClick={() => handlePostReply(comment._id)}
                    disabled={submitting || !replyContent.trim()}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 disabled:opacity-40"
                  >
                    Reply
                  </button>
                </div>
              )}

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pl-8 border-l-2 border-slate-100 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <img
                            src={reply.user?.avatar}
                            alt={reply.user?.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-slate-800">
                            {reply.user?.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatDistanceToNow(new Date(reply.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        {(user?._id === reply.user?._id || isAdmin) && (
                          <button
                            onClick={() => handleDeleteComment(reply._id)}
                            className="text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 pl-8 leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
