import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Sparkles,
  TrendingUp,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import StatsCards from "../components/admin/StatsCards";
import UserTable from "../components/admin/UserTable";
import BlogTable from "../components/admin/BlogTable";
import CommentTable from "../components/admin/CommentTable";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'users', 'blogs', 'comments'
  const [stats, setStats] = useState(null);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const [statsRes, usersRes, blogsRes, commentsRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/users"),
        API.get("/admin/blogs"),
        API.get("/admin/comments"),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
        setCategoryDistribution(statsRes.data.categoryDistribution || []);
        setRecentBlogs(statsRes.data.recentBlogs || []);
        setRecentUsers(statsRes.data.recentUsers || []);
      }
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (blogsRes.data.success) setBlogs(blogsRes.data.blogs);
      if (commentsRes.data.success) setComments(commentsRes.data.comments);
    } catch (err) {
      toast.error("Failed to load admin telemetry data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-rose-200 shadow-card text-center">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-sm text-slate-600 mb-6">
          You need administrator privileges to access the BuildNotes command dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Staff Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            BuildNotes Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global metrics, content moderation, and user management.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-full shadow-xs transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 mb-8 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "overview"
              ? "border-brand-600 text-brand-600 font-bold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Telemetry Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "users"
              ? "border-brand-600 text-brand-600 font-bold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("blogs")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "blogs"
              ? "border-brand-600 text-brand-600 font-bold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Articles ({blogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("comments")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "comments"
              ? "border-brand-600 text-brand-600 font-bold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Comments ({comments.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      {loading ? (
        <div className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
      ) : (
        <>
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Metric Cards */}
              <StatsCards stats={stats} />

              {/* Category distribution breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
                <h3 className="text-base font-bold text-slate-900 mb-4">
                  Article Distribution by Category
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {categoryDistribution.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color || "#0c8ee9" }}
                        />
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xl font-extrabold text-slate-900">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Two Column: Recent Articles & Recent Users */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Articles */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900">
                      Recent Published Stories
                    </h3>
                    <button
                      onClick={() => setActiveTab("blogs")}
                      className="text-xs font-semibold text-brand-600 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {recentBlogs.map((b) => (
                      <div key={b._id} className="py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {b.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            by {b.author?.name} • {b.views || 0} views
                          </p>
                        </div>
                        {b.category && (
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shrink-0"
                            style={{ backgroundColor: b.category.color || "#0c8ee9" }}
                          >
                            {b.category.name}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900">
                      Recently Registered Writers
                    </h3>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="text-xs font-semibold text-brand-600 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {recentUsers.map((u) => (
                      <div key={u._id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {u.name}
                            </p>
                            <p className="text-xs text-slate-400 truncate">{u.email}</p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            u.role === "admin"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <UserTable users={users} onRefresh={fetchDashboardData} />
          )}

          {activeTab === "blogs" && (
            <BlogTable blogs={blogs} onRefresh={fetchDashboardData} />
          )}

          {activeTab === "comments" && (
            <CommentTable comments={comments} onRefresh={fetchDashboardData} />
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
