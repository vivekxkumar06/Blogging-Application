import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Heart, Mail, CheckCircle2, Sparkles, Send } from "lucide-react";
import API from "../../services/api";
import { useToast } from "../../context/ToastContext";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const { data } = await API.post("/newsletter/subscribe", { email });
      toast.success(data.message || "Thank you for subscribing!");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 sm:pt-16 pb-8 sm:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 sm:pb-12 border-b border-slate-800">
          {/* Brand Info (Cols 1-5 on LG) */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                B
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
                BuildNotes
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  MERN
                </span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed">
              An open engineering publication dedicated to modern software architecture,
              distributed cloud infrastructure, developer workflows, and system design.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://github.com/Saurabhtbj1201/BuildNotes-MERN-Blog-Application"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links & Categories - 2 columns on mobile for compact layout */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6 sm:gap-8">
            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Explore
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link to="/" className="text-slate-300 hover:text-white transition-colors block py-1">
                    Home Editorial
                  </Link>
                </li>
                <li>
                  <Link to="/search" className="text-slate-300 hover:text-white transition-colors block py-1">
                    All Articles
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search?sort=trending"
                    className="text-slate-300 hover:text-white transition-colors block py-1"
                  >
                    Trending Stories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search?sort=popular"
                    className="text-slate-300 hover:text-white transition-colors block py-1"
                  >
                    Most Popular
                  </Link>
                </li>
                <li>
                  <Link to="/bookmarks" className="text-slate-300 hover:text-white transition-colors block py-1">
                    Reading List
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Categories
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link
                    to="/search?category=web-development"
                    className="text-slate-300 hover:text-white transition-colors block py-1"
                  >
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search?category=artificial-intelligence"
                    className="text-slate-300 hover:text-white transition-colors block py-1"
                  >
                    AI & Systems
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search?category=ui-ux-design"
                    className="text-slate-300 hover:text-white transition-colors block py-1"
                  >
                    UI/UX Design
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search?category=cloud-devops"
                    className="text-slate-300 hover:text-white transition-colors block py-1"
                  >
                    Cloud & DevOps
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search?category=engineering-career"
                    className="text-slate-300 hover:text-white transition-colors block py-1"
                  >
                    Career Growth
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Mini Newsletter Card (Cols 10-12 on LG) */}
          <div className="lg:col-span-3 space-y-3 bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60">
            <div className="flex items-center gap-2 text-brand-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Weekly Dispatch
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Curated software architecture insights delivered to your inbox every Friday.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2.5 pt-1">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@company.com"
                  required
                  className="w-full bg-slate-900/90 text-xs text-white placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-brand-500 focus:outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
              >
                <span>{loading ? "Subscribing..." : "Subscribe Free"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} BuildNotes MERN Blog Application. All rights reserved.</p>
          <div className="flex items-center justify-center gap-1.5 text-slate-300">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for engineering teams</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
