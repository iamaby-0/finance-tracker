import React, { useState, useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', value: 11850, percentage: 28, color: '#FF667A' },
  { name: 'Shopping', value: 7620, percentage: 18, color: '#FF8A48' },
  { name: 'Transport', value: 5930, percentage: 14, color: '#F6C85F' },
  { name: 'Bills & Utilities', value: 5120, percentage: 12, color: '#20D6C7' },
  { name: 'Entertainment', value: 4230, percentage: 10, color: '#45B7F5' },
  { name: 'Health & Fitness', value: 3400, percentage: 8, color: '#FF6EA7' },
  { name: 'Others', value: 4200, percentage: 10, color: '#B18AFF' }
];

export default function SpendingBreakdownChart({
  categories = null,
  totalExpenses = 42350,
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

  const items = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const totalAmount = totalExpenses || items.reduce((sum, item) => sum + (item.value || 0), 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#18272C] border border-[#24363B] rounded-xl px-3 py-2 shadow-2xl text-xs z-50">
          <p className="font-semibold text-[#F1F5F4] flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: data.color }}
            />
            {data.name}
          </p>
          <p className="text-[#35E9A0] font-bold mt-1">
            {formatCurrency(data.value)}{' '}
            <span className="text-[#71848A] font-normal">({data.percentage}%)</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 flex flex-col justify-between h-full shadow-sm">
      {/* Header Row: Title & Period Dropdown */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
          Spending Breakdown
        </h3>

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

      {/* Donut Chart & Category Legend Grid */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-1">
        {/* Donut Chart with Center Amount */}
        <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex-shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={items}
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={84}
                paddingAngle={2.5}
                dataKey="value"
                stroke="none"
              >
                {items.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Spent Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-base sm:text-lg font-bold text-[#F1F5F4] tracking-tight">
              {formatCurrency(totalAmount)}
            </span>
            <span className="text-[11px] text-[#71848A] font-medium tracking-wide">
              Total Spent
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-1.5">
          {items.map((cat, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs py-0.5 hover:bg-[#18272C]/40 px-1.5 rounded-md transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-[#A5B4B8] truncate text-[12px]">
                  {cat.name}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                <span className="text-[#71848A] text-[11px] w-7 text-right">
                  {cat.percentage}%
                </span>
                <span className="font-semibold text-[#F1F5F4] text-[12px] w-14 text-right">
                  {formatCurrency(cat.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
