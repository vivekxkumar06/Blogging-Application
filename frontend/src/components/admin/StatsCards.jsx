import React from "react";
import { Users, FileText, CheckCircle2, FileEdit, MessageSquare, Eye } from "lucide-react";

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Registered Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "Total Articles",
      value: stats?.totalBlogs || 0,
      icon: FileText,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      title: "Published Stories",
      value: stats?.publishedBlogs || 0,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Saved Drafts",
      value: stats?.draftBlogs || 0,
      icon: FileEdit,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      title: "Reader Responses",
      value: stats?.totalComments || 0,
      icon: MessageSquare,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      title: "Cumulative Page Views",
      value: (stats?.totalViews || 0).toLocaleString(),
      icon: Eye,
      color: "text-rose-600 bg-rose-50 border-rose-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card hover:shadow-soft transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {c.title}
              </span>
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center ${c.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {c.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
