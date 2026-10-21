import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function GoalFilters({
  activeFilter = 'All Goals',
  onFilterChange,
  sortBy = 'Target Date',
  onSortChange,
  counts = { all: 5, active: 3, completed: 2, onTrack: 3, atRisk: 1 }
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  const tabs = [
    { id: 'All Goals', label: `All Goals (${counts.all || 0})` },
    { id: 'Active', label: `Active (${counts.active || 0})` },
    { id: 'Completed', label: `Completed (${counts.completed || 0})` },
    { id: 'On Track', label: `On Track (${counts.onTrack || 0})` },
    { id: 'At Risk', label: `At Risk (${counts.atRisk || 0})` }
  ];

  const sortOptions = [
    'Target Date',
    'Name',
    'Progress',
    'Target Amount',
    'Recently Created'
  ];

  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#15372F] text-[#35E9A0] border border-[#35E9A0]/30 shadow-xs'
                  : 'bg-[#121E22] text-[#71848A] hover:text-[#A5B4B8] border border-[#24363B]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sort Dropdown */}
      <div className="relative shrink-0 self-end sm:self-auto" ref={sortRef}>
        <button
          onClick={() => setSortOpen(!sortOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121E22] border border-[#24363B] text-xs text-[#A5B4B8] hover:text-[#F1F5F4] hover:border-[#35E9A0]/40 transition cursor-pointer"
        >
          <span>Sort by: <strong className="text-[#F1F5F4]">{sortBy}</strong></span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#71848A] transition-transform duration-200 ${
              sortOpen ? 'rotate-180 text-[#35E9A0]' : ''
            }`}
          />
        </button>

        {sortOpen && (
          <div className="absolute right-0 mt-1.5 w-44 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl p-1 z-30 animate-in fade-in zoom-in-95 duration-100">
            {sortOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onSortChange(opt);
                  setSortOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer text-left ${
                  sortBy === opt
                    ? 'bg-[#15372F] text-[#35E9A0]'
                    : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#203238]'
                }`}
              >
                <span>{opt}</span>
                {sortBy === opt && <Check className="w-3.5 h-3.5 text-[#35E9A0]" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
