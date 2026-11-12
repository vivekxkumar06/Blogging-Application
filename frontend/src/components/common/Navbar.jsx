import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  PenSquare,
  Search,
  Bookmark,
  User,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  BookOpen,
} from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:bg-brand-600 transition-colors">
                B
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                  BuildNotes
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                    MERN
                  </span>
                </span>
                <span className="text-[10px] font-medium text-slate-600 hidden sm:block -mt-0.5">
                  Editorial Engineering & Tech
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg transition-colors hover:text-slate-900 ${
                  location.pathname === "/"
                    ? "text-slate-900 font-semibold"
                    : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/search"
                className={`px-3 py-2 rounded-lg transition-colors hover:text-slate-900 ${
                  location.pathname === "/search"
                    ? "text-slate-900 font-semibold"
                    : ""
                }`}
              >
                Explore
              </Link>
              <Link
                to="/search?sort=trending"
                className="px-3 py-2 rounded-lg transition-colors hover:text-slate-900 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Trending
              </Link>
            </nav>
          </div>

          {/* Search bar (desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center flex-1 max-w-xs relative"
          >
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, tags, authors..."
              className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 placeholder-slate-400 pl-9 pr-4 py-2 rounded-full border border-transparent focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all outline-none"
            />
          </form>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Search Icon button on mobile/tablet */}
            <Link
              to="/search"
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>

            {isAuthenticated ? (
              <>
                {/* Bookmarks Link */}
                <Link
                  to="/bookmarks"
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
                  title="Saved Articles"
                >
                  <Bookmark className="w-5 h-5" />
                </Link>

                {/* Write Article Button */}
                <Link
                  to="/create"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-full shadow-sm hover:shadow transition-all"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Write</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-slate-200 transition-all"
                    aria-label="User menu"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-float border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {user?.email}
                        </p>
                        {isAdmin && (
                          <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Administrator
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          to={`/profile/${user?._id}`}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          View Profile
                        </Link>
                        <Link
                          to="/create"
                          className="sm:hidden flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <PenSquare className="w-4 h-4 text-slate-400" />
                          Write Story
                        </Link>
                        <Link
                          to="/bookmarks"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Bookmark className="w-4 h-4 text-slate-400" />
                          Reading List
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-brand-600" />
                            Admin Dashboard
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-full shadow-sm hover:shadow transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles & authors..."
              className="w-full bg-slate-100 pl-9 pr-4 py-2 text-sm rounded-lg border-0 focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </form>

          <div className="flex flex-col space-y-1 font-medium text-slate-700 pt-1">
            <Link
              to="/"
              className="px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/search"
              className="px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Explore Articles
            </Link>
            <Link
              to="/search?sort=trending"
              className="px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Trending Stories
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/create"
                  className="px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-brand-600 font-semibold"
                >
                  <PenSquare className="w-4 h-4" />
                  Write a Post
                </Link>
                <Link
                  to="/bookmarks"
                  className="px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <Bookmark className="w-4 h-4 text-slate-400" />
                  My Reading List
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-700 font-semibold flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
