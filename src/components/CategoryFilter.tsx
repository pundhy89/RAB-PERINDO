import React from 'react';
import { Search } from 'lucide-react';

interface Props {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  itemCounts: Record<string, number>;
  totalCount: number;
}

export const CategoryFilter: React.FC<Props> = ({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  itemCounts,
  totalCount,
}) => {
  return (
    <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Segmented Filter Control */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg overflow-x-auto max-w-full">
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Semua ({totalCount})
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeCategory.toLowerCase() === cat.toLowerCase()
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat} ({itemCounts[cat] || 0})
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative w-full md:w-64">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari aplikasi atau fungsi..."
          className="w-full text-xs bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
