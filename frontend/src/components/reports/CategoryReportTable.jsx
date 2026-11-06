import React, { useState, useRef, useEffect } from 'react';
import {
  Utensils,
  ShoppingBag,
  Car,
  FileText,
  Film,
  Heart,
  MoreHorizontal,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function CategoryReportTable({
  categories = null,
  selectedPeriod = 'This Month',
  onPeriodChange
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rows = Array.isArray(categories) ? categories : [];

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 flex flex-col justify-between h-full shadow-sm">
      {/* Header Row: Title & Period Dropdown */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
            Category Report
          </h3>
          <p className="text-xs text-[#71848A] mt-0.5">
            Detailed breakdown by category
          </p>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18272C] border border-[#24363B] text-xs font-medium text-[#F1F5F4] hover:border-[#35E9A0]/50 transition cursor-pointer"
          >
            <span>{selectedPeriod}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#71848A] transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-[#35E9A0]' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-30 animate-in fade-in duration-100">
              {['This Month', 'Last Month', 'This Year'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    if (onPeriodChange) onPeriodChange(p);
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-xs text-left transition cursor-pointer ${
                    selectedPeriod === p
                      ? 'text-[#35E9A0] bg-[#15372F] font-semibold'
                      : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#203238]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[460px]">
          <thead>
            <tr className="border-b border-[#24363B] text-[11px] font-semibold uppercase tracking-wider text-[#71848A]">
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 text-center">Transactions</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
              <th className="py-2.5 px-3 text-center">Percentage</th>
              <th className="py-2.5 px-3 text-right">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#24363B]/40 text-xs">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-[#71848A]">
                  No category records found for this period.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
              const Icon = row.icon || Utensils;
              const isUp = row.trendDirection === 'up';

              return (
                <tr
                  key={row.id || row.name}
                  className="hover:bg-[#18272C]/40 transition-colors group"
                >
                  {/* Category Name & Icon */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 border border-[#24363B]/60 ${
                          row.iconBg || 'bg-[#18272C]'
                        } ${row.iconColor || 'text-[#35E9A0]'}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-[#F1F5F4] truncate">
                        {row.name}
                      </span>
                    </div>
                  </td>

                  {/* Transactions Count */}
                  <td className="py-2.5 px-3 text-center text-[#A5B4B8]">
                    {row.transactions}
                  </td>

                  {/* Amount */}
                  <td className="py-2.5 px-3 text-right font-semibold text-[#F1F5F4]">
                    {formatCurrency(row.amount)}
                  </td>

                  {/* Percentage */}
                  <td className="py-2.5 px-3 text-center text-[#A5B4B8]">
                    {row.percentage}%
                  </td>

                  {/* Trend Indicator with Mini Sparkline */}
                  <td className="py-2.5 px-3 text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      {/* Mini Sparkline SVG */}
                      <svg className="w-10 h-3 overflow-visible" viewBox="0 0 40 12">
                        <path
                          d={isUp ? 'M0,10 L14,8 L26,4 L40,1' : 'M0,2 L14,5 L26,8 L40,11'}
                          fill="none"
                          stroke={isUp ? '#FF667A' : '#35E9A0'}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span
                        className={`text-[11px] font-semibold flex items-center gap-0.5 ${
                          isUp ? 'text-[#FF667A]' : 'text-[#35E9A0]'
                        }`}
                      >
                        {isUp ? (
                          <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                        )}
                        {row.trendPercent}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
