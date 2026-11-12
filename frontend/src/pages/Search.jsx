import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Filter, X, Sparkles, SlidersHorizontal } from "lucide-react";
import API from "../services/api";
import BlogCard from "../components/blog/BlogCard";
import { BlogCardSkeleton } from "../components/common/Skeleton";
import EmptyState from "../components/common/EmptyState";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const tagParam = searchParams.get("tag") || "";
  const sortParam = searchParams.get("sort") || "newest";

  const [search, setSearch] = useState(queryParam);
  const [category, setCategory] = useState(categoryParam);
  const [tag, setTag] = useState(tagParam);
  const [sort, setSort] = useState(sortParam);

  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ totalBlogs: 0 });

  // Fetch categories list
  useEffect(() => {
    API.get("/categories").then(({ data }) => {
      if (data.success) setCategories(data.categories);
    });
  }, []);

  // Sync state with URL params
  useEffect(() => {
    setSearch(queryParam);
    setCategory(categoryParam);
    setTag(tagParam);
    setSort(sortParam);
  }, [queryParam, categoryParam, tagParam, sortParam]);

  // Execute query
  useEffect(() => {
    const executeSearch = async () => {
      try {
        setLoading(true);
        let url = `/blogs?limit=12&sort=${sort}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (tag) url += `&tag=${encodeURIComponent(tag)}`;

        const { data } = await API.get(url);
        if (data.success) {
          setBlogs(data.blogs);
          setPagination(data.pagination);
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };

    executeSearch();
  }, [search, category, tag, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (search.trim()) params.q = search.trim();
    if (category) params.category = category;
    if (tag) params.tag = tag;
    if (sort) params.sort = sort;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setTag("");
    setSort("newest");
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Explore Articles & Topics
        </h1>
        <p className="text-sm text-slate-500">
          Discover insights across web development, cloud systems, and AI architecture.
        </p>

        {/* Big Search Input */}
        <form onSubmit={handleSearchSubmit} className="mt-6 relative">
          <SearchIcon className="w-5 h-5 absolute left-4 top-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords, titles, tags..."
            className="w-full pl-12 pr-28 py-3.5 bg-white text-base text-slate-800 placeholder-slate-400 rounded-full border border-slate-200/90 shadow-card focus:border-brand-500 focus:ring-4 focus:ring-brand-50 outline-none transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter and Sorting Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-card mb-8 flex flex-wrap items-center justify-between gap-4">
        {/* Category selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Category:
          </span>
          <button
            onClick={() => {
              setCategory("");
              setSearchParams({ ...Object.fromEntries(searchParams), category: "" });
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              !category
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => {
                setCategory(c.slug);
                setSearchParams({ ...Object.fromEntries(searchParams), category: c.slug });
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                category === c.slug
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Sort and Active Tag */}
        <div className="flex items-center gap-3">
          {tag && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
              <span>Tag: #{tag}</span>
              <button
                onClick={() => {
                  setTag("");
                  const p = Object.fromEntries(searchParams);
                  delete p.tag;
                  setSearchParams(p);
                }}
              >
                <X className="w-3 h-3 text-brand-500 hover:text-brand-700" />
              </button>
            </span>
          )}

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setSearchParams({ ...Object.fromEntries(searchParams), sort: e.target.value });
              }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending Today</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {(search || category || tag || sort !== "newest") && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-6 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-slate-800">{blogs.length}</strong> of{" "}
          <strong className="text-slate-800">{pagination.totalBlogs || blogs.length}</strong>{" "}
          articles
        </span>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(6)].map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <EmptyState
          title="No matching articles found"
          description="Try broadening your search query or removing specific category filters."
          actionText="Clear All Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
