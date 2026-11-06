import React, { useState, useRef, useEffect } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { ChevronDown, PieChart as PieIcon } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function SpendingCategoryChart({
  categories = [],
  totalSpent = 0,
  selectedPeriod: initialPeriod = 'This Month',
  onPeriodChange
}) {
  const [period, setPeriod] = useState(initialPeriod);
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const periods = ['This Month', 'Last Month', 'This Year'];

  // Sync when prop changes
  useEffect(() => {
    if (initialPeriod) {
      setPeriod(initialPeriod);
    }
  }, [initialPeriod]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPeriodDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const data = Array.isArray(categories) ? categories : [];
  const currentTotal = totalSpent !== undefined && totalSpent !== null ? totalSpent : data.reduce((s, i) => s + (i.value || 0), 0);

  const handleSelectPeriod = (newPeriod) => {
    setPeriod(newPeriod);
    setPeriodDropdownOpen(false);
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-2.5 shadow-xl text-xs backdrop-blur-md z-50">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-semibold text-[#F1F5F4]">{item.name}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[#A5B4B8]">
            <span>Amount:</span>
            <span className="font-semibold text-[#F1F5F4]">
              {formatCurrency(item.value)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[#A5B4B8]">
            <span>Share:</span>
            <span className="font-semibold text-[#35E9A0]">{item.percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-3.5 sm:p-4.5 h-full flex flex-col justify-between overflow-hidden">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight">
            Spending by Category
          </h3>
          <p className="text-[11px] text-[#71848A] mt-0.5">
            Total Spent:{' '}
            <span className="font-semibold text-[#F1F5F4]">
              {formatCurrency(currentTotal)}
            </span>
          </p>
        </div>

        {/* Period Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#18272C] border border-[#24363B] text-[11px] font-medium text-[#A5B4B8] hover:border-[#35E9A0]/50 transition cursor-pointer"
          >
            <span>{period}</span>
            <ChevronDown className="w-3 h-3 text-[#71848A]" />
          </button>

          {periodDropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-[#18272C] border border-[#24363B] rounded-xl shadow-xl py-1 z-50">
              {periods.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSelectPeriod(p)}
                  className={`w-full px-3 py-1.5 text-xs text-left transition cursor-pointer ${
                    period === p
                      ? 'text-[#35E9A0] bg-[#123D32]/50 font-medium'
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

      {data.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center my-auto">
          <div className="w-10 h-10 rounded-xl bg-[#18272C] border border-[#24363B] flex items-center justify-center text-[#71848A] mb-2.5">
            <PieIcon className="w-5 h-5 text-[#35E9A0]" />
          </div>
          <p className="text-xs font-semibold text-[#F1F5F4]">No spending recorded</p>
          <p className="text-[11px] text-[#71848A] mt-0.5">Expenses will be grouped by category here.</p>
        </div>
      ) : (
        /* Donut Chart & Legend Row */
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center">
          {/* Donut Chart with Center Total */}
          <div className="sm:col-span-5 relative flex items-center justify-center">
            <div className="w-40 h-40 sm:w-44 sm:h-44 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="#121E22"
                    strokeWidth={2}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        className="transition-opacity duration-200 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Total inside Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#71848A]">
                  Spent
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#F1F5F4] tracking-tight mt-0.5">
                  {formatCurrency(currentTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Right 58%: Category Legend Breakdown */}
          <div className="sm:col-span-7 space-y-1.5 sm:space-y-2">
            {data.slice(0, 5).map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between text-xs py-0.5 hover:bg-[#18272C]/40 px-1.5 rounded-lg transition"
              >
                {/* Left: Color dot & Category Name */}
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-[#A5B4B8] truncate text-[11px] sm:text-xs">
                    {category.name}
                  </span>
                </div>

                {/* Right: Amount & Percentage */}
                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                  <span className="font-semibold text-[#F1F5F4] text-[11px] sm:text-xs">
                    {formatCurrency(category.value)}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-[#71848A] w-7 text-right">
                    {category.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
