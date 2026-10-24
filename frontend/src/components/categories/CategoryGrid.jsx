import React from 'react';
import { Search } from 'lucide-react';
import CategoryCard from './CategoryCard';

export default function CategoryGrid({
  categories = [],
  activeTab = 'All',
  onTabChange,
  searchQuery = '',
  onSearchChange,
  onEditCategory,
  onDeleteCategory
}) {
  const expenseCount = categories.filter((c) => c.type === 'Expense').length;
  const incomeCount = categories.filter((c) => c.type === 'Income').length;
  const allCount = categories.length;

  // Filter categories by activeTab and searchQuery
  const filtered = categories.filter((c) => {
    const matchesTab =
      activeTab === 'All' ? true : c.type.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (c.description || '').toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 flex flex-col justify-between h-full shadow-sm">
      {/* Header Row: Title, Filter Tabs, and Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight mr-1">
            All Categories
          </h3>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-[#18272C] p-1 rounded-xl border border-[#24363B]">
            <button
              type="button"
              onClick={() => onTabChange('All')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'All'
                  ? 'bg-[#15372F] text-[#35E9A0] shadow-xs'
                  : 'text-[#A5B4B8] hover:text-[#F1F5F4]'
              }`}
            >
              All ({allCount})
            </button>
            <button
              type="button"
              onClick={() => onTabChange('Expense')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'Expense'
                  ? 'bg-[#15372F] text-[#35E9A0] shadow-xs'
                  : 'text-[#A5B4B8] hover:text-[#F1F5F4]'
              }`}
            >
              Expense ({expenseCount})
            </button>
            <button
              type="button"
              onClick={() => onTabChange('Income')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'Income'
                  ? 'bg-[#15372F] text-[#35E9A0] shadow-xs'
                  : 'text-[#A5B4B8] hover:text-[#F1F5F4]'
              }`}
            >
              Income ({incomeCount})
            </button>
          </div>
        </div>

        {/* Search Categories Input */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-[#71848A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-[#18272C] border border-[#24363B] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0]/50 transition"
          />
        </div>
      </div>

      {/* Category Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 my-auto">
          {filtered.map((cat) => (
            <CategoryCard
              key={cat.id || cat._id || cat.name}
              category={cat}
              onEdit={onEditCategory}
              onDelete={onDeleteCategory}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-[#24363B] my-auto">
          <p className="text-sm font-semibold text-[#A5B4B8]">No categories found</p>
          <p className="text-xs text-[#71848A] mt-1">
            Try adjusting your search query or filter tab.
          </p>
        </div>
      )}
    </div>
  );
}
