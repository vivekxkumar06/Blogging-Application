import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Trash2, ExternalLink, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import API from "../../services/api";
import { useToast } from "../../context/ToastContext";

const CommentTable = ({ comments, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const toast = useToast();

  const filteredComments = comments.filter((c) => {
    return (
      c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.blog?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      setLoadingId(commentId);
      const { data } = await API.delete(`/comments/${commentId}`);
      toast.success(data.message);
      onRefresh();
    } catch (err) {
      toast.error("Failed to delete comment");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
      {/* Search */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by text, user, or story..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-5">Author</th>
              <th className="py-3 px-4">Comment</th>
              <th className="py-3 px-4">Story</th>
              <th className="py-3 px-4">Posted</th>
              <th className="py-3 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredComments.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                  No comments match your search.
                </td>
              </tr>
            ) : (
              filteredComments.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={c.user?.avatar}
                        alt={c.user?.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-semibold text-slate-800 text-xs">
                        {c.user?.name || "Anonymous"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-sm">
                    <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                      {c.content}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap max-w-xs">
                    {c.blog ? (
                      <Link
                        to={`/blog/${c.blog.slug || c.blog._id}`}
                        target="_blank"
                        className="text-xs font-medium text-brand-600 hover:underline flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{c.blog.title}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        [Story removed]
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-400">
                    {c.createdAt
                      ? formatDistanceToNow(new Date(c.createdAt), {
                          addSuffix: true,
                        })
                      : "—"}
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      disabled={loadingId === c._id}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50"
                      title="Delete Comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommentTable;
