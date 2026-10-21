import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange
}) {
  const effectiveTotalPages = Math.max(1, totalPages);

  // Generate page numbers array (with a max of 5 visible pages or compact)
  const getPages = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(effectiveTotalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-end gap-1.5 pt-5 select-none">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`w-9 h-9 rounded-lg bg-[#121E22] border border-[#24363B] flex items-center justify-center text-xs transition ${
          currentPage <= 1
            ? 'opacity-40 cursor-not-allowed text-[#71848A]'
            : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C] cursor-pointer'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Numbered Page Buttons */}
      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium transition cursor-pointer ${
              isActive
                ? 'bg-[#123D32] border border-[#35E9A0] text-[#35E9A0] font-bold shadow-xs'
                : 'bg-[#121E22] border border-[#24363B] text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C]'
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`w-9 h-9 rounded-lg bg-[#121E22] border border-[#24363B] flex items-center justify-center text-xs transition ${
          currentPage >= totalPages
            ? 'opacity-40 cursor-not-allowed text-[#71848A]'
            : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C] cursor-pointer'
        }`}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
