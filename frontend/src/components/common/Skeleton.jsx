import React from "react";

export const BlogCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-card flex flex-col justify-between animate-pulse">
      <div>
        <div className="w-full h-48 bg-slate-200 rounded-xl mb-4" />
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-slate-200" />
          <div className="w-24 h-3 bg-slate-200 rounded" />
          <div className="w-16 h-3 bg-slate-200 rounded ml-auto" />
        </div>
        <div className="w-3/4 h-5 bg-slate-200 rounded mb-2" />
        <div className="w-full h-4 bg-slate-200 rounded mb-1" />
        <div className="w-2/3 h-4 bg-slate-200 rounded" />
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
        <div className="w-20 h-5 bg-slate-200 rounded-full" />
        <div className="w-12 h-4 bg-slate-200 rounded" />
      </div>
    </div>
  );
};

export const HeroSkeleton = () => {
  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-card animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div className="lg:col-span-7 space-y-4">
        <div className="w-28 h-6 bg-slate-200 rounded-full" />
        <div className="w-full h-10 bg-slate-200 rounded-xl" />
        <div className="w-4/5 h-10 bg-slate-200 rounded-xl" />
        <div className="w-full h-4 bg-slate-200 rounded mt-4" />
        <div className="w-3/4 h-4 bg-slate-200 rounded" />
        <div className="flex items-center gap-3 pt-4">
          <div className="w-10 h-10 rounded-full bg-slate-200" />
          <div className="space-y-1.5">
            <div className="w-24 h-3.5 bg-slate-200 rounded" />
            <div className="w-32 h-3 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
      <div className="lg:col-span-5">
        <div className="w-full h-72 sm:h-80 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  );
};

export const DetailsSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-8">
      <div className="w-28 h-6 bg-slate-200 rounded-full" />
      <div className="w-full h-12 bg-slate-200 rounded-xl" />
      <div className="w-3/4 h-12 bg-slate-200 rounded-xl" />
      <div className="flex items-center gap-4 py-4 border-y border-slate-100">
        <div className="w-12 h-12 rounded-full bg-slate-200" />
        <div className="space-y-2">
          <div className="w-32 h-4 bg-slate-200 rounded" />
          <div className="w-24 h-3 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="w-full h-96 bg-slate-200 rounded-2xl" />
      <div className="space-y-4 pt-4">
        <div className="w-full h-4 bg-slate-200 rounded" />
        <div className="w-full h-4 bg-slate-200 rounded" />
        <div className="w-5/6 h-4 bg-slate-200 rounded" />
        <div className="w-full h-4 bg-slate-200 rounded" />
      </div>
    </div>
  );
};
