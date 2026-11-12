import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Clock, Flame, Users, BookOpen } from "lucide-react";
import { format } from "date-fns";

const HeroSection = ({ featuredBlog }) => {
  return (
    <section className="pt-6 sm:pt-10 pb-8 sm:pb-14">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>The Modern Editorial Platform for Engineers</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-4">
          Architectural ideas. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600">
            Unfiltered engineering.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Deep dives into full-stack systems, distributed cloud infrastructure, design
          tokens, and the emerging frontier of autonomous AI software agents.
        </p>
      </div>

      {/* Featured Editorial Card */}
      {featuredBlog && (
        <div className="relative group bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-card hover:shadow-float transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                  <Flame className="w-3.5 h-3.5" />
                  Featured Story
                </span>
                {featuredBlog.category && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-xs"
                    style={{ backgroundColor: featuredBlog.category.color || "#0c8ee9" }}
                  >
                    {featuredBlog.category.name}
                  </span>
                )}
                <span className="text-xs text-slate-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {featuredBlog.readingTime || 4} min read
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors leading-tight">
                <Link to={`/blog/${featuredBlog.slug || featuredBlog._id}`}>
                  {featuredBlog.title}
                </Link>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 line-clamp-3 leading-relaxed">
                {featuredBlog.excerpt}
              </p>

              {/* Author & CTA */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
                <Link
                  to={`/profile/${featuredBlog.author?._id}`}
                  className="flex items-center gap-3 group/author"
                >
                  <img
                    src={featuredBlog.author?.avatar}
                    alt={featuredBlog.author?.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover/author:text-brand-600 transition-colors">
                      {featuredBlog.author?.name}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {featuredBlog.createdAt
                        ? format(new Date(featuredBlog.createdAt), "MMMM d, yyyy")
                        : "Recently published"}
                    </p>
                  </div>
                </Link>

                <Link
                  to={`/blog/${featuredBlog.slug || featuredBlog._id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-brand-600 text-white text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-5 overflow-hidden rounded-2xl aspect-[16/10] bg-slate-100 shadow-inner">
              <Link to={`/blog/${featuredBlog.slug || featuredBlog._id}`}>
                <img
                  src={featuredBlog.coverImage}
                  alt={featuredBlog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
