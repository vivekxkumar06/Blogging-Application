import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Heart, Mail, CheckCircle2 } from "lucide-react";
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
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                B
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                BuildNotes
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              An open publication dedicated to modern software architecture, web
              technologies, engineering leadership, and user interface craftsmanship.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/Saurabhtbj1201/BuildNotes-MERN-Blog-Application"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Editorial
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white transition-colors">
                  All Articles
                </Link>
              </li>
              <li>
                <Link
                  to="/search?sort=trending"
                  className="hover:text-white transition-colors"
                >
                  Trending Stories
                </Link>
              </li>
              <li>
                <Link
                  to="/search?sort=popular"
                  className="hover:text-white transition-colors"
                >
                  Most Popular
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="hover:text-white transition-colors">
                  Reading List
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/search?category=web-development"
                  className="hover:text-white transition-colors"
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  to="/search?category=artificial-intelligence"
                  className="hover:text-white transition-colors"
                >
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link
                  to="/search?category=ui-ux-design"
                  className="hover:text-white transition-colors"
                >
                  UI/UX & Design
                </Link>
              </li>
              <li>
                <Link
                  to="/search?category=cloud-devops"
                  className="hover:text-white transition-colors"
                >
                  Cloud & DevOps
                </Link>
              </li>
              <li>
                <Link
                  to="/search?category=engineering-career"
                  className="hover:text-white transition-colors"
                >
                  Career & Leadership
                </Link>
              </li>
            </ul>
          </div>

          {/* Mini Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Weekly Dispatch
            </h4>
            <p className="text-xs text-slate-400">
              Get the top software insights delivered straight to your inbox each Friday.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                required
                className="w-full bg-slate-800 text-xs text-white placeholder-slate-500 px-3.5 py-2 rounded-lg border border-slate-700 focus:border-brand-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? "Subscribing..." : "Subscribe Free"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} BuildNotes Blog Application. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision on the</span>
            <span className="font-semibold text-slate-200">MERN Stack</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
