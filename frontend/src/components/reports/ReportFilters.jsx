import React, { useState, useRef, useEffect } from 'react';
import { Calendar, FileText, BarChart3, ChevronDown, Check } from 'lucide-react';

export default function ReportFilters({
  dateRange = 'Oct 1, 2026 - Oct 31, 2026',
  onDateRangeChange,
  reportType = 'Monthly Report',
  onReportTypeChange,
  viewBy = 'Category',
  onViewByChange,
  onGenerateReport,
  loading = false
}) {
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);

  const dateRef = useRef(null);
  const typeRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dateRef.current && !dateRef.current.contains(e.target)) setDateDropdownOpen(false);
      if (typeRef.current && !typeRef.current.contains(e.target)) setTypeDropdownOpen(false);
      if (viewRef.current && !viewRef.current.contains(e.target)) setViewDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dateOptions = [
    'Oct 1, 2026 - Oct 31, 2026',
    'Sep 1, 2026 - Sep 30, 2026',
    'Jan 1, 2026 - Dec 31, 2026'
  ];

  const typeOptions = [
    'Monthly Report',
    'Income Report',
    'Expense Report',
    'Annual Report'
  ];

  const viewOptions = [
    'Category',
    'Month',
    'Payment Method',
    'Merchant'
  ];

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* 1. Date Range Control */}
        <div className="relative" ref={dateRef}>
          <label className="block text-[11px] font-medium text-[#A5B4B8] mb-1.5 uppercase tracking-wider">
            Date Range
          </label>
          <button
            type="button"
            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#18272C] border border-[#24363B] text-xs font-medium text-[#F1F5F4] hover:border-[#35E9A0]/50 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Calendar className="w-4 h-4 text-[#71848A] flex-shrink-0" />
              <span className="truncate">{dateRange}</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#71848A] flex-shrink-0 transition-transform duration-200 ${
                dateDropdownOpen ? 'rotate-180 text-[#35E9A0]' : ''
              }`}
            />
          </button>

          {dateDropdownOpen && (
            <div className="absolute left-0 right-0 mt-1.5 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-30 animate-in fade-in duration-100">
              {dateOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    if (onDateRangeChange) onDateRangeChange(opt);
                    setDateDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition cursor-pointer ${
                    dateRange === opt
                      ? 'text-[#35E9A0] bg-[#15372F] font-semibold'
                      : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#203238]'
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {dateRange === opt && <Check className="w-3.5 h-3.5 text-[#35E9A0]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Report Type Control */}
        <div className="relative" ref={typeRef}>
          <label className="block text-[11px] font-medium text-[#A5B4B8] mb-1.5 uppercase tracking-wider">
            Report Type
          </label>
          <button
            type="button"
            onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#18272C] border border-[#24363B] text-xs font-medium text-[#F1F5F4] hover:border-[#35E9A0]/50 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5 truncate">
              <FileText className="w-4 h-4 text-[#35E9A0] flex-shrink-0" />
              <span className="truncate">{reportType}</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#71848A] flex-shrink-0 transition-transform duration-200 ${
                typeDropdownOpen ? 'rotate-180 text-[#35E9A0]' : ''
              }`}
            />
          </button>

          {typeDropdownOpen && (
            <div className="absolute left-0 right-0 mt-1.5 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-30 animate-in fade-in duration-100">
              {typeOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    if (onReportTypeChange) onReportTypeChange(opt);
                    setTypeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition cursor-pointer ${
                    reportType === opt
                      ? 'text-[#35E9A0] bg-[#15372F] font-semibold'
                      : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#203238]'
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {reportType === opt && <Check className="w-3.5 h-3.5 text-[#35E9A0]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. View By Control */}
        <div className="relative" ref={viewRef}>
          <label className="block text-[11px] font-medium text-[#A5B4B8] mb-1.5 uppercase tracking-wider">
            View By
          </label>
          <button
            type="button"
            onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#18272C] border border-[#24363B] text-xs font-medium text-[#F1F5F4] hover:border-[#35E9A0]/50 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5 truncate">
              <BarChart3 className="w-4 h-4 text-[#45B7F5] flex-shrink-0" />
              <span className="truncate">{viewBy}</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#71848A] flex-shrink-0 transition-transform duration-200 ${
                viewDropdownOpen ? 'rotate-180 text-[#35E9A0]' : ''
              }`}
            />
          </button>

          {viewDropdownOpen && (
            <div className="absolute left-0 right-0 mt-1.5 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-30 animate-in fade-in duration-100">
              {viewOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    if (onViewByChange) onViewByChange(opt);
                    setViewDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition cursor-pointer ${
                    viewBy === opt
                      ? 'text-[#35E9A0] bg-[#15372F] font-semibold'
                      : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#203238]'
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {viewBy === opt && <Check className="w-3.5 h-3.5 text-[#35E9A0]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Generate Report Button */}
        <div>
          <button
            type="button"
            onClick={onGenerateReport}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] text-xs font-bold tracking-wide transition-all shadow-md hover:shadow-[#35E9A0]/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-[42px]"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-[#0B1114] border-t-transparent rounded-full animate-spin" />
            ) : (
              'Generate Report'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
