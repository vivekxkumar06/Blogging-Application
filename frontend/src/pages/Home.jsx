import React, { useState, useEffect } from "react";
import API from "../services/api";
import HeroSection from "../components/home/HeroSection";
import CategoryBar from "../components/home/CategoryBar";
import TrendingSection from "../components/home/TrendingSection";
import AuthorsSection from "../components/home/AuthorsSection";
import NewsletterSection from "../components/home/NewsletterSection";
import BlogCard from "../components/blog/BlogCard";
import { BlogCardSkeleton, HeroSkeleton } from "../components/common/Skeleton";
import EmptyState from "../components/common/EmptyState";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const Home = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, hasMore: false });

  const [initialLoading, setInitialLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(false);

  // Fetch initial collections
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [featuredRes, trendingRes, catRes, authorsRes] = await Promise.all([
          API.get("/blogs/featured"),
          API.get("/blogs/trending"),
          API.get("/categories"),
          API.get("/users/authors/recommended"),
        ]);

        if (featuredRes.data.success) setFeaturedBlogs(featuredRes.data.blogs);
        if (trendingRes.data.success) setTrendingBlogs(trendingRes.data.blogs);
        if (catRes.data.success) setCategories(catRes.data.categories);
        if (authorsRes.data.success) setAuthors(authorsRes.data.authors);
      } catch (err) {
        console.error("Failed to load home initial data", err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch paginated blogs based on category & page
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setBlogsLoading(true);
        let url = `/blogs?page=${page}&limit=6`;
        if (selectedCategory) {
          url += `&category=${selectedCategory}`;
        }
        const { data } = await API.get(url);
        if (data.success) {
          setBlogs(data.blogs);
          setPagination(data.pagination);
        }
      } catch (err) {
        console.error("Failed to load blogs feed", err);
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, [page, selectedCategory]);

  const handleSelectCategory = (catSlug) => {
    setSelectedCategory(catSlug);
    setPage(1); // reset to page 1 on category change
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Section */}
      {initialLoading ? (
        <HeroSkeleton />
      ) : (
        <HeroSection featuredBlog={featuredBlogs[0]} />
      )}

      {/* Trending Section */}
      {!initialLoading && trendingBlogs.length > 0 && (
        <TrendingSection trendingBlogs={trendingBlogs} />
      )}

      {/* Categories Bar */}
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Feed Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {selectedCategory
              ? `Stories in ${
                  categories.find((c) => c.slug === selectedCategory)?.name ||
                  selectedCategory
                }`
              : "Latest Technical Dispatches"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Carefully written and peer-reviewed articles from our engineering collective.
          </p>
        </div>
      </div>

      {/* Blog Cards Grid */}
      {blogsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(6)].map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <EmptyState
          title="No articles found in this topic"
          description="Be the first to share an article in this category!"
          actionText="Write a Story"
          actionLink="/create"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12 pt-8 border-t border-slate-200/80">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 px-2">
                <span>Page</span>
                <span className="text-slate-900 font-bold">{page}</span>
                <span>of</span>
                <span>{pagination.totalPages}</span>
              </div>

              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Recommended Authors Section */}
      <AuthorsSection authors={authors} />

      {/* Newsletter Subscription Banner */}
      <NewsletterSection />
    </div>
  );
};

export default Home;
