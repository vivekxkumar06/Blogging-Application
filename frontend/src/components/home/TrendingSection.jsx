import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Clock, TrendingUp } from "lucide-react";
import { format } from "date-fns";

const TrendingSection = ({ trendingBlogs }) => {
  if (!trendingBlogs || trendingBlogs.length === 0) return null;

  return (
    <section className="mb-14 pb-12 border-b border-slate-200/80">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <TrendingUp className="w-4 h-4" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Trending on BuildNotes
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {trendingBlogs.map((blog, idx) => (
          <div key={blog._id} className="flex items-start gap-4 group">
            {/* Number indicator */}
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-200 group-hover:text-brand-500 transition-colors font-mono select-none">
              0{idx + 1}
            </span>

            {/* Post info */}
            <div className="space-y-1.5 flex-1">
              <Link
                to={`/profile/${blog.author?._id}`}
                className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-brand-600 transition-colors"
              >
                <img
                  src={blog.author?.avatar}
                  alt={blog.author?.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="truncate max-w-[150px]">{blog.author?.name}</span>
              </Link>

              <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                <Link to={`/blog/${blog.slug || blog._id}`}>{blog.title}</Link>
              </h4>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>
                  {blog.createdAt
                    ? format(new Date(blog.createdAt), "MMM d")
                    : "Recently"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {blog.readingTime || 3}m read
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;
