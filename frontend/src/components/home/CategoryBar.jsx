import React from "react";
import { Layers } from "lucide-react";

const CategoryBar = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="py-6 border-y border-slate-200/80 my-8">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onSelectCategory("")}
          className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            selectedCategory === ""
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Topics</span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat._id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cat.color || "#3B82F6" }}
              />
              <span>{cat.name}</span>
              {cat.articleCount > 0 && (
                <span className="text-[10px] opacity-60">
                  ({cat.articleCount})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBar;
