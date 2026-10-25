import React, { useState, useRef, useEffect } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_INCOME_CATEGORIES = {
  'This Month': {
    total: 85000,
    categories: [
      { name: 'Salary', value: 70000, percentage: 82, color: '#35E9A0' },
      { name: 'Freelance', value: 8500, percentage: 10, color: '#B18AFF' },
      { name: 'Investment', value: 4200, percentage: 5, color: '#F6C85F' },
      { name: 'Side Income', value: 2300, percentage: 3, color: '#FF667A' },
      { name: 'Other', value: 0, percentage: 0, color: '#20D6C7' },
    ]
  },
  'Last Month': {
    total: 78000,
    categories: [
      { name: 'Salary', value: 65000, percentage: 83, color: '#35E9A0' },
      { name: 'Freelance', value: 7000, percentage: 9, color: '#B18AFF' },
      { name: 'Investment', value: 3800, percentage: 5, color: '#F6C85F' },
      { name: 'Side Income', value: 2200, percentage: 3, color: '#FF667A' },
      { name: 'Other', value: 0, percentage: 0, color: '#20D6C7' },
    ]
  },
  'This Year': {
    total: 640000,
    categories: [
      { name: 'Salary', value: 520000, percentage: 81, color: '#35E9A0' },
      { name: 'Freelance', value: 65000, percentage: 10, color: '#B18AFF' },
      { name: 'Investment', value: 35000, percentage: 6, color: '#F6C85F' },
      { name: 'Side Income', value: 20000, percentage: 3, color: '#FF667A' },
      { name: 'Other', value: 0, percentage: 0, color: '#20D6C7' },
    ]
  }
};

export default function IncomeCategoryChart({
  categories = null,
  totalIncome = null,
  selectedPeriod: initialPeriod = 'This Month',
  onPeriodChange
}) {
  const [period, setPeriod] = useState(initialPeriod);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const periods = ['This Month', 'Last Month', 'This Year'];

  useEffect(() => {
    if (initialPeriod) {
      setPeriod(initialPeriod);
    }
  }, [initialPeriod]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeDataset = DEFAULT_INCOME_CATEGORIES[period] || DEFAULT_INCOME_CATEGORIES['This Month'];
  const data = (period === 'This Month' && categories && categories.length > 0)
    ? categories
    : activeDataset.categories;

  const currentTotal = (period === 'This Month' && totalIncome)
    ? totalIncome
    : activeDataset.total;

  const handleSelectPeriod = (newPeriod) => {
    setPeriod(newPeriod);
    setDropdownOpen(false);
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
      {/* Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight">
          Income by Source
        </h3>

        {/* Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] hover:border-[#35E9A0]/50 transition cursor-pointer"
          >
            <span>{period}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#71848A] transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-[#35E9A0]' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              {periods.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSelectPeriod(p)}
                  className={`w-full px-3 py-1.5 text-xs text-left transition cursor-pointer ${
                    period === p
                      ? 'text-[#35E9A0] bg-[#15372F] font-medium'
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

      {/* Donut Chart & Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 my-auto w-full min-w-0">
        {/* Donut Chart with Center Text */}
        <div className="relative w-[135px] h-[135px] sm:w-[145px] sm:h-[145px] shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data.filter((d) => d.value > 0)}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                stroke="#121E22"
                strokeWidth={2}
                animationDuration={600}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}-${index}`}
                    fill={entry.color}
                    className="hover:opacity-85 transition-opacity cursor-pointer outline-none"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Donut Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center">
            <span className="text-xs sm:text-sm font-bold text-[#F1F5F4] tracking-tight">
              {formatCurrency(currentTotal)}
            </span>
            <span className="text-[9px] text-[#71848A] font-medium uppercase tracking-wider">
              Total Income
            </span>
          </div>
        </div>

        {/* Legend on the right */}
        <div className="w-full sm:flex-1 min-w-0 space-y-1 sm:space-y-1.5">
          {data.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center justify-between text-xs py-0.5 px-1 rounded hover:bg-[#18272C]/60 transition min-w-0 group"
            >
              {/* Dot & Category Name */}
              <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-[#A5B4B8] group-hover:text-[#F1F5F4] truncate font-medium text-[11px] sm:text-[12px]">
                  {cat.name}
                </span>
              </div>

              {/* Percentage & Amount */}
              <div className="flex items-center gap-2 shrink-0 text-right">
                <span className="text-[#71848A] text-[10px] sm:text-[11px] w-7 text-right">
                  {cat.percentage}%
                </span>
                <span className="text-[#F1F5F4] font-semibold text-[11px] sm:text-[12px] min-w-[55px] text-right">
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
