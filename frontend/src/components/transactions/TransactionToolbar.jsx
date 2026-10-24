import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, ChevronDown, Filter, X } from 'lucide-react';

export default function TransactionToolbar({
  activeType = 'All',
  onTypeChange,
  searchQuery = '',
  onSearchChange,
  selectedPeriod = 'This Month',
  onPeriodChange,
  selectedCategory = 'All Categories',
  onCategoryChange,
  categoryOptions = []
}) {
  const [dateOpen, setDateOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const dateRef = useRef(null);
  const categoryRef = useRef(null);

  const dateOptions = [
    'This Month',
    'Last Month',
    'Last 3 Months',
    'This Year',
    'All Time'
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setDateOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveFilters =
    activeType !== 'All' ||
    searchQuery.trim() !== '' ||
    selectedPeriod !== 'This Month' ||
    selectedCategory !== 'All Categories';

  const handleResetFilters = () => {
    onTypeChange('All');
    onSearchChange('');
    onPeriodChange('This Month');
    onCategoryChange('All Categories');
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-6">
      {/* Left: Segmented Tabs (All, Income, Expenses) */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
        <div className="inline-flex p-1 rounded-xl bg-[#121E22] border border-[#24363B]">
          {['All', 'Income', 'Expenses'].map((tab) => {
            const isActive = activeType === tab;
            return (
              <button
                key={tab}
                onClick={() => onTypeChange(tab)}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#123D32] text-[#35E9A0] border border-[#35E9A0] shadow-xs'
                    : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C] border border-transparent'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Controls: Search, Date Filter, Category Filter */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 flex-1 lg:justify-end">
        {/* Search Input */}
        <div className="relative w-full sm:w-auto sm:min-w-[180px] flex-1 max-w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-[#71848A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search transactions..."
            className="w-full h-10 pl-9 pr-8 bg-[#121E22] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] focus:ring-1 focus:ring-[#35E9A0]/30 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71848A] hover:text-[#F1F5F4]"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative" ref={dateRef}>
          <button
            onClick={() => {
              setDateOpen(!dateOpen);
              setCategoryOpen(false);
            }}
            className="h-10 px-3 sm:px-3.5 rounded-xl bg-[#121E22] border border-[#24363B] hover:border-[#35E9A0]/40 text-[#F1F5F4] text-xs font-medium flex items-center gap-1.5 sm:gap-2 hover:bg-[#18272C] transition cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#71848A] shrink-0" />
            <span className="whitespace-nowrap">{selectedPeriod}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#71848A] transition-transform duration-200 shrink-0 ${
                dateOpen ? 'rotate-180 text-[#35E9A0]' : ''
              }`}
            />
          </button>

          {dateOpen && (
            <div className="absolute right-0 mt-2 w-44 max-w-[calc(100vw-2rem)] bg-[#121E22] border border-[#24363B] rounded-xl shadow-2xl p-1 z-30 animate-in fade-in zoom-in-95 duration-150">
              {dateOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onPeriodChange(opt);
                    setDateOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                    selectedPeriod === opt
                      ? 'bg-[#123D32] text-[#35E9A0]'
                      : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Filter Dropdown */}
        <div className="relative" ref={categoryRef}>
          <button
            onClick={() => {
              setCategoryOpen(!categoryOpen);
              setDateOpen(false);
            }}
            className="h-10 px-3.5 rounded-xl bg-[#121E22] border border-[#24363B] hover:border-[#35E9A0]/40 text-[#F1F5F4] text-xs font-medium flex items-center gap-2 hover:bg-[#18272C] transition cursor-pointer"
          >
            <Filter className="w-4 h-4 text-[#71848A]" />
            <span className="truncate max-w-[120px]">{selectedCategory}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#71848A] transition-transform duration-200 ${
                categoryOpen ? 'rotate-180 text-[#35E9A0]' : ''
              }`}
            />
          </button>

          {categoryOpen && (
            <div className="absolute right-0 mt-2 w-52 max-h-64 overflow-y-auto scrollbar-thin bg-[#121E22] border border-[#24363B] rounded-xl shadow-2xl p-1 z-30 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  onCategoryChange('All Categories');
                  setCategoryOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedCategory === 'All Categories'
                    ? 'bg-[#123D32] text-[#35E9A0]'
                    : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C]'
                }`}
              >
                All Categories
              </button>
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onCategoryChange(cat);
                    setCategoryOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#123D32] text-[#35E9A0]'
                      : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear Filters button (if any filter is active) */}
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="h-10 px-2.5 rounded-xl text-xs text-[#FF667A] hover:bg-[#3D1A22]/40 transition flex items-center gap-1 cursor-pointer"
            title="Reset all filters"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
