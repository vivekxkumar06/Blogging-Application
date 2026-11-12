import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star, Trash2, ExternalLink, Eye, Heart } from "lucide-react";
import { format } from "date-fns";
import API from "../../services/api";
import { useToast } from "../../context/ToastContext";

const BlogTable = ({ blogs, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingId, setLoadingId] = useState(null);
  const toast = useToast();

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleFeature = async (blogId) => {
    try {
      setLoadingId(blogId);
      const { data } = await API.put(`/admin/blogs/${blogId}/feature`);
      toast.success(data.message);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update featured state");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteBlog = async (blogId, title) => {
    if (!window.confirm(`Delete article: "${title}"?`)) return;

    try {
      setLoadingId(blogId);
      const { data } = await API.delete(`/blogs/${blogId}`);
      toast.success(data.message);
      onRefresh();
    } catch (err) {
      toast.error("Failed to delete article");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
      {/* Search & Filters */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or author..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-medium text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-5">Article</th>
              <th className="py-3 px-4">Author</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Stats</th>
              <th className="py-3 px-4">Featured</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredBlogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                  No articles match your criteria.
                </td>
              </tr>
            ) : (
              filteredBlogs.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3 max-w-md">
                      <img
                        src={b.coverImage}
                        alt={b.title}
                        className="w-12 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/blog/${b.slug || b._id}`}
                          className="font-semibold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1 text-sm block"
                        >
                          {b.title}
                        </Link>
                        <span className="text-[11px] text-slate-400">
                          {b.createdAt
                            ? format(new Date(b.createdAt), "MMM d, yyyy")
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                    {b.author?.name || "Unknown"}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {b.category && (
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: b.category.color || "#0c8ee9" }}
                      >
                        {b.category.name}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {b.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        {b.likes?.length || 0}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleFeature(b._id)}
                      disabled={loadingId === b._id}
                      className={`p-1.5 rounded-lg border transition-all ${
                        b.isFeatured
                          ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                          : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                      }`}
                      title={b.isFeatured ? "Unfeature Story" : "Make Featured"}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          b.isFeatured ? "fill-amber-500" : ""
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        to={`/blog/${b.slug || b._id}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        title="View Live"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteBlog(b._id, b.title)}
                        disabled={loadingId === b._id}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

export default BlogTable;
