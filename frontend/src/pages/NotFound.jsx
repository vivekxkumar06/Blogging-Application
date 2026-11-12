import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-card p-8 sm:p-10 text-center space-y-4">
        <span className="text-6xl font-extrabold text-slate-200 font-mono block">
          404
        </span>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Page Not Found
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
          The story or page you're searching for might have been removed, had its slug
          changed, or is temporarily unavailable.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full shadow-sm hover:shadow transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Feed</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
