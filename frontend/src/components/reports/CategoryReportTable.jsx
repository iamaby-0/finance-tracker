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

const DEFAULT_ROWS = [
  {
    id: 1,
    name: 'Food & Dining',
    icon: Utensils,
    iconBg: 'bg-[#2A161B]',
    iconColor: 'text-[#FF667A]',
    transactions: 12,
    amount: 11850,
    percentage: 28,
    trendDirection: 'up',
    trendPercent: '18%'
  },
  {
    id: 2,
    name: 'Shopping',
    icon: ShoppingBag,
    iconBg: 'bg-[#251E38]',
    iconColor: 'text-[#B18AFF]',
    transactions: 8,
    amount: 7620,
    percentage: 18,
    trendDirection: 'down',
    trendPercent: '5%'
  },
  {
    id: 3,
    name: 'Transport',
    icon: Car,
    iconBg: 'bg-[#152538]',
    iconColor: 'text-[#45B7F5]',
    transactions: 6,
    amount: 5930,
    percentage: 14,
    trendDirection: 'up',
    trendPercent: '12%'
  },
  {
    id: 4,
    name: 'Bills & Utilities',
    icon: FileText,
    iconBg: 'bg-[#123832]',
    iconColor: 'text-[#20D6C7]',
    transactions: 5,
    amount: 5120,
    percentage: 12,
    trendDirection: 'down',
    trendPercent: '8%'
  },
  {
    id: 5,
    name: 'Entertainment',
    icon: Film,
    iconBg: 'bg-[#2E1825]',
    iconColor: 'text-[#FF6EA7]',
    transactions: 4,
    amount: 4230,
    percentage: 10,
    trendDirection: 'up',
    trendPercent: '25%'
  },
  {
    id: 6,
    name: 'Health & Fitness',
    icon: Heart,
    iconBg: 'bg-[#2C1820]',
    iconColor: 'text-[#FF8A48]',
    transactions: 3,
    amount: 3400,
    percentage: 8,
    trendDirection: 'down',
    trendPercent: '10%'
  },
  {
    id: 7,
    name: 'Others',
    icon: MoreHorizontal,
    iconBg: 'bg-[#18272C]',
    iconColor: 'text-[#A5B4B8]',
    transactions: 5,
    amount: 4200,
    percentage: 10,
    trendDirection: 'up',
    trendPercent: '8%'
  }
];

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

  const rows = categories && categories.length > 0 ? categories : DEFAULT_ROWS;

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
            {rows.map((row) => {
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
