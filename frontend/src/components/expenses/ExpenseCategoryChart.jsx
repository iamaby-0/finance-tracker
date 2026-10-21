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

const DEFAULT_EXPENSE_CATEGORIES = {
  'This Month': {
    total: 42350,
    categories: [
      { name: 'Food & Dining', value: 11850, percentage: 28, color: '#FF667A' },
      { name: 'Shopping', value: 7620, percentage: 18, color: '#FF8A48' },
      { name: 'Transport', value: 5930, percentage: 14, color: '#F6C85F' },
      { name: 'Bills & Utilities', value: 5120, percentage: 12, color: '#20D6C7' },
      { name: 'Entertainment', value: 4230, percentage: 10, color: '#45B7F5' },
      { name: 'Health & Fitness', value: 3400, percentage: 8, color: '#FF6EA7' },
      { name: 'Others', value: 4200, percentage: 10, color: '#B18AFF' }
    ]
  },
  'Last Month': {
    total: 38900,
    categories: [
      { name: 'Food & Dining', value: 10800, percentage: 28, color: '#FF667A' },
      { name: 'Shopping', value: 6800, percentage: 17, color: '#FF8A48' },
      { name: 'Transport', value: 5400, percentage: 14, color: '#F6C85F' },
      { name: 'Bills & Utilities', value: 5200, percentage: 13, color: '#20D6C7' },
      { name: 'Entertainment', value: 3900, percentage: 10, color: '#45B7F5' },
      { name: 'Health & Fitness', value: 3100, percentage: 8, color: '#FF6EA7' },
      { name: 'Others', value: 3700, percentage: 10, color: '#B18AFF' }
    ]
  },
  'This Year': {
    total: 318500,
    categories: [
      { name: 'Food & Dining', value: 89000, percentage: 28, color: '#FF667A' },
      { name: 'Shopping', value: 57000, percentage: 18, color: '#FF8A48' },
      { name: 'Transport', value: 45000, percentage: 14, color: '#F6C85F' },
      { name: 'Bills & Utilities', value: 38500, percentage: 12, color: '#20D6C7' },
      { name: 'Entertainment', value: 32000, percentage: 10, color: '#45B7F5' },
      { name: 'Health & Fitness', value: 26000, percentage: 8, color: '#FF6EA7' },
      { name: 'Others', value: 31000, percentage: 10, color: '#B18AFF' }
    ]
  }
};

export default function ExpenseCategoryChart({
  categories = null,
  totalExpenses = null,
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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentDefault =
    DEFAULT_EXPENSE_CATEGORIES[period] || DEFAULT_EXPENSE_CATEGORIES['This Month'];

  const categoryList =
    categories && categories.length > 0 ? categories : currentDefault.categories;

  const total =
    totalExpenses !== null && totalExpenses !== undefined && totalExpenses > 0
      ? totalExpenses
      : currentDefault.total;

  const handleSelectPeriod = (p) => {
    setPeriod(p);
    setDropdownOpen(false);
    if (onPeriodChange) {
      onPeriodChange(p);
    }
  };

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#18272C] border border-[#24363B] p-2.5 rounded-xl shadow-xl">
          <p className="text-xs font-semibold text-[#F1F5F4]">{data.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <span className="text-xs font-bold text-[#F1F5F4]">
              {formatCurrency(data.value)} ({data.percentage}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 shadow-lg flex flex-col justify-between h-full">
      {/* Header Row: Title & Period Selector */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
            Expenses by Category
          </h3>
          <p className="text-xs text-[#71848A] mt-0.5">
            Spending distribution
          </p>
        </div>

        {/* Dropdown Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18272C] border border-[#24363B] text-xs font-medium text-[#F1F5F4] hover:border-[#FF667A]/40 transition cursor-pointer"
          >
            <span>{period}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#71848A] transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-[#FF667A]' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
              {periods.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSelectPeriod(p)}
                  className={`w-full px-3 py-1.5 text-xs text-left transition cursor-pointer ${
                    period === p
                      ? 'text-[#FF667A] bg-[#3D1A22] font-semibold'
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

      {/* Donut & Legend Container */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
        {/* Donut Chart with Centered Total */}
        <div className="relative w-[180px] h-[180px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryList}
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={82}
                paddingAngle={3}
                dataKey="value"
                stroke="#121E22"
                strokeWidth={2}
              >
                {categoryList.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-sm font-bold text-[#F1F5F4] tracking-tight">
              {formatCurrency(total)}
            </span>
            <span className="text-[10px] text-[#71848A] font-medium tracking-wide">
              Total Spent
            </span>
          </div>
        </div>

        {/* Legend List on Right */}
        <div className="flex-1 w-full space-y-1.5 pl-1 max-h-[220px] overflow-y-auto scrollbar-thin">
          {categoryList.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs py-0.5 group hover:bg-[#18272C]/40 px-1.5 rounded-lg transition"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[#A5B4B8] group-hover:text-[#F1F5F4] transition truncate max-w-[100px] sm:max-w-[120px]">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[#71848A] text-[11px] font-medium">
                  {item.percentage}%
                </span>
                <span className="text-[#F1F5F4] font-semibold text-right min-w-[55px]">
                  {formatCurrency(item.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
