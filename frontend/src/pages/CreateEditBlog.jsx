import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, Image as ImageIcon, Sparkles, ArrowLeft, Check, AlertCircle } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import RichTextEditor from "../components/blog/RichTextEditor";

const CreateEditBlog = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80"
  );
  const [status, setStatus] = useState("published");
  const [isFeatured, setIsFeatured] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch categories & blog data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await API.get("/categories");
        if (catRes.data.success) {
          setCategories(catRes.data.categories);
          if (!isEditing && catRes.data.categories.length > 0) {
            setCategory(catRes.data.categories[0]._id);
          }
        }

        if (isEditing) {
          const { data } = await API.get(`/blogs/${id}`);
          if (data.success && data.blog) {
            const b = data.blog;
            setTitle(b.title || "");
            setExcerpt(b.excerpt || "");
            setContent(b.content || "");
            setCategory(b.category?._id || b.category || "");
            setTags(b.tags ? b.tags.join(", ") : "");
            setCoverImage(b.coverImage || "");
            setStatus(b.status || "published");
            setIsFeatured(b.isFeatured || false);
          }
        }
      } catch (err) {
        toast.error("Failed to load article details");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Only image files are allowed");
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success && data.url) {
        setCoverImage(data.url);
        toast.success("Cover image uploaded successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (targetStatus) => {
    if (!title.trim()) {
      return toast.warning("Please provide a story title");
    }
    if (!excerpt.trim()) {
      return toast.warning("Please provide a short excerpt or summary");
    }
    if (!content.trim() || content === "<p></p>") {
      return toast.warning("Please write some article content");
    }
    if (!category) {
      return toast.warning("Please select an article category");
    }

    try {
      setSubmitting(true);
      const postData = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content,
        category,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        coverImage,
        status: targetStatus || status,
        isFeatured: isAdmin ? isFeatured : false,
      };

      if (isEditing) {
        const { data } = await API.put(`/blogs/${id}`, postData);
        toast.success(data.message || "Article updated successfully!");
        navigate(`/blog/${data.blog.slug || data.blog._id}`);
      } else {
        const { data } = await API.post("/blogs", postData);
        toast.success(data.message || "Article published successfully!");
        navigate(`/blog/${data.blog.slug || data.blog._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save article");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg mx-auto mb-4" />
        <div className="h-4 w-96 bg-slate-200 rounded mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Back</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleSubmit("draft")}
            disabled={submitting}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-full shadow-xs transition-all disabled:opacity-40"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit("published")}
            disabled={submitting}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-full shadow-sm hover:shadow transition-all disabled:opacity-40"
          >
            {submitting ? "Publishing..." : isEditing ? "Save Changes" : "Publish Article"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title Input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title of your story..."
            className="w-full text-2xl sm:text-4xl font-extrabold text-slate-900 placeholder-slate-300 bg-transparent border-0 border-b border-transparent focus:border-slate-300 focus:outline-none transition-all pb-2 leading-tight"
          />
        </div>

        {/* Excerpt / Subtitle */}
        <div>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Write a compelling subtitle or excerpt (1-2 sentences)..."
            rows={2}
            className="w-full text-sm sm:text-base text-slate-600 placeholder-slate-400 bg-transparent border-0 border-b border-slate-200 focus:border-brand-500 focus:outline-none transition-all pb-2 resize-none"
          />
        </div>

        {/* Category & Tags Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="React, Architecture, TypeScript, NodeJS"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>

        {/* Cover Image Upload / URL */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Cover Image
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-8">
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="Paste an Unsplash image URL or upload below..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div className="sm:col-span-4">
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span>{uploadingImage ? "Uploading..." : "Upload File"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Cover Preview */}
          {coverImage && (
            <div className="mt-3 overflow-hidden rounded-2xl aspect-[21/9] max-h-48 border border-slate-200 bg-slate-50 relative group">
              <img
                src={coverImage}
                alt="Cover Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80";
                }}
              />
              <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-white">
                Cover Image Preview
              </span>
            </div>
          )}
        </div>

        {/* Admin only: Highlight as Featured */}
        {isAdmin && (
          <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-medium text-indigo-900">
            <input
              type="checkbox"
              id="isFeaturedCheckbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded border-indigo-300 focus:ring-brand-500"
            />
            <label htmlFor="isFeaturedCheckbox" className="cursor-pointer">
              Feature this story prominently on the homepage hero section
            </label>
          </div>
        )}

        {/* Tiptap Rich Text Editor */}
        <div className="pt-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Article Content (Rich Text)
          </label>
          <RichTextEditor
            content={content}
            onChange={(html) => setContent(html)}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateEditBlog;
