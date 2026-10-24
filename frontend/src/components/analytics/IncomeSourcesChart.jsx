import React, { useState, useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_SOURCES = [
  { name: 'Salary', value: 70000, percentage: 82, color: '#35E9A0' },
  { name: 'Freelance', value: 8500, percentage: 10, color: '#B18AFF' },
  { name: 'Investment', value: 4200, percentage: 5, color: '#45B7F5' },
  { name: 'Side Income', value: 2300, percentage: 3, color: '#FF8A48' },
  { name: 'Others', value: 0, percentage: 0, color: '#20D6C7' }
];

export default function IncomeSourcesChart({
  sources = null,
  totalIncome = 85000,
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

  const items = sources && sources.length > 0 ? sources : DEFAULT_SOURCES;
  const totalAmount = totalIncome || items.reduce((sum, item) => sum + (item.value || 0), 0);

  // Filter out 0 value items for chart rendering so slices don't collapse or overlap
  const chartItems = items.filter((item) => (item.value || 0) > 0);

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
          Income Sources
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

      {/* Donut Chart & Legend List */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-1">
        {/* Donut Chart */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 xl:w-44 xl:h-44 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartItems.length > 0 ? chartItems : [{ name: 'Income', value: 1, color: '#35E9A0' }]}
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={68}
                paddingAngle={2.5}
                dataKey="value"
                stroke="none"
              >
                {(chartItems.length > 0 ? chartItems : [{ color: '#35E9A0' }]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Income Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-sm sm:text-base font-bold text-[#F1F5F4] tracking-tight">
              {formatCurrency(totalAmount)}
            </span>
            <span className="text-[10px] text-[#71848A] font-medium tracking-wide">
              Total Income
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-1.5">
          {items.map((src, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs py-0.5 hover:bg-[#18272C]/40 px-1.5 rounded-md transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: src.color }}
                />
                <span className="text-[#A5B4B8] truncate text-[12px]">
                  {src.name}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="text-[#71848A] text-[11px] w-7 text-right">
                  {src.percentage}%
                </span>
                <span className="font-semibold text-[#F1F5F4] text-[12px] w-14 text-right">
                  {formatCurrency(src.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
