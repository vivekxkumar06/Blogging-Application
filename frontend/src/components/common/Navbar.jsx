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
  Home,
  Compass,
  Layers,
  ArrowRight,
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

  const isHomeActive = location.pathname === "/";
  const isExploreActive =
    location.pathname === "/search" && !location.search.includes("sort=trending");
  const isTrendingActive =
    location.pathname === "/search" && location.search.includes("sort=trending");
  const isBookmarksActive = location.pathname === "/bookmarks";
  const isCreateActive = location.pathname === "/create";

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* LEFT SIDE: Logo & Brand (Always visible on mobile & desktop) */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:bg-brand-600 transition-colors">
              B
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                BuildNotes
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  MERN
                </span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 hidden sm:block -mt-0.5">
                Editorial Engineering & Tech
              </span>
            </div>
          </Link>

          {/* CENTER: Desktop Navigation Links & Search (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 ml-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors hover:text-slate-900 ${
                isHomeActive ? "text-slate-900 font-bold bg-slate-100/80" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/search"
              className={`px-3 py-2 rounded-lg transition-colors hover:text-slate-900 ${
                isExploreActive ? "text-slate-900 font-bold bg-slate-100/80" : ""
              }`}
            >
              Explore
            </Link>
            <Link
              to="/search?sort=trending"
              className={`px-3 py-2 rounded-lg transition-colors hover:text-slate-900 flex items-center gap-1.5 ${
                isTrendingActive ? "text-slate-900 font-bold bg-slate-100/80" : ""
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Trending
            </Link>
          </nav>

          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center flex-1 max-w-xs relative mx-6"
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

          {/* RIGHT SIDE DESKTOP ACTIONS (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <>
                <Link
                  to="/bookmarks"
                  className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative"
                  title="Saved Articles"
                >
                  <Bookmark className="w-5 h-5" />
                </Link>

                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-full shadow-xs hover:shadow transition-all"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Write</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-slate-200 transition-all"
                    aria-label="User menu"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-float border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {user?.email}
                        </p>
                        {isAdmin && (
                          <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Administrator
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          to={`/profile/${user?._id}`}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          View Profile
                        </Link>
                        <Link
                          to="/create"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <PenSquare className="w-4 h-4 text-slate-400" />
                          Write Story
                        </Link>
                        <Link
                          to="/bookmarks"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Bookmark className="w-4 h-4 text-slate-400" />
                          Reading List
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm font-bold text-brand-600 hover:bg-brand-50 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-brand-600" />
                            Admin Dashboard
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
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
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-full shadow-xs hover:shadow transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT SIDE MOBILE ONLY: The 3-Line Hamburger Menu Icon */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-800 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-all focus:outline-none"
              aria-label="Open mobile navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-900 stroke-[2.5]" />
              ) : (
                <Menu className="w-6 h-6 text-slate-900 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DRAWER: Opens when user clicks the 3 lines */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-5 pt-4 pb-8 space-y-5 shadow-2xl animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto">
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, topics, authors..."
              className="w-full bg-slate-100 text-slate-900 pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none placeholder-slate-400 font-medium"
            />
          </form>

          {/* Primary Navigation Links */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Menu Navigation
            </p>

            <Link
              to="/"
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-base font-semibold transition-colors ${
                isHomeActive
                  ? "bg-slate-900 text-white font-bold"
                  : "text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home Editorial</span>
            </Link>

            <Link
              to="/search"
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-base font-semibold transition-colors ${
                isExploreActive
                  ? "bg-slate-900 text-white font-bold"
                  : "text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Compass className="w-5 h-5" />
              <span>Explore All Articles</span>
            </Link>

            <Link
              to="/search?sort=trending"
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-base font-semibold transition-colors ${
                isTrendingActive
                  ? "bg-slate-900 text-white font-bold"
                  : "text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Trending Stories</span>
            </Link>

            <Link
              to="/bookmarks"
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-base font-semibold transition-colors ${
                isBookmarksActive
                  ? "bg-slate-900 text-white font-bold"
                  : "text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Bookmark className="w-5 h-5 text-brand-600" />
              <span>Reading List / Saved</span>
            </Link>

            <Link
              to="/create"
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-base font-bold transition-colors ${
                isCreateActive
                  ? "bg-brand-600 text-white"
                  : "text-brand-600 hover:bg-brand-50"
              }`}
            >
              <PenSquare className="w-5 h-5" />
              <span>Write a New Story</span>
            </Link>
          </div>

          {/* Popular Topics Section */}
          <div className="pt-3 border-t border-slate-100">
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Browse Topics
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link
                to="/search?category=web-development"
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Web Development
              </Link>
              <Link
                to="/search?category=artificial-intelligence"
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                AI & Systems
              </Link>
              <Link
                to="/search?category=cloud-devops"
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Cloud & DevOps
              </Link>
              <Link
                to="/search?category=ui-ux-design"
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                UI/UX Design
              </Link>
            </div>
          </div>

          {/* User Account / Auth Section */}
          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Admin
                    </span>
                  )}
                </div>

                <div className="space-y-1 font-semibold text-sm">
                  <Link
                    to={`/profile/${user?._id}`}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Author Profile</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Admin Command Center</span>
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center py-3 px-4 rounded-xl border border-slate-200 text-slate-800 text-sm font-bold hover:bg-slate-50 transition-colors"
                >
                  Sign In to Account
                </Link>
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
