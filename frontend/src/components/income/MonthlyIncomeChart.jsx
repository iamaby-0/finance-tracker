import React, { useState, useRef, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_INCOME_TRENDS = {
  'This Year': [
    { month: 'Jan', amount: 22000 },
    { month: 'Feb', amount: 35000 },
    { month: 'Mar', amount: 68000 },
    { month: 'Apr', amount: 32000 },
    { month: 'May', amount: 38000 },
    { month: 'Jun', amount: 40000 },
    { month: 'Jul', amount: 80000 },
    { month: 'Aug', amount: 35000 },
    { month: 'Sep', amount: 40000 },
    { month: 'Oct', amount: 75000 },
    { month: 'Nov', amount: 38000 },
    { month: 'Dec', amount: 39000 },
  ],
  '2026': [
    { month: 'Jan', amount: 22000 },
    { month: 'Feb', amount: 35000 },
    { month: 'Mar', amount: 68000 },
    { month: 'Apr', amount: 32000 },
    { month: 'May', amount: 38000 },
    { month: 'Jun', amount: 40000 },
    { month: 'Jul', amount: 80000 },
    { month: 'Aug', amount: 35000 },
    { month: 'Sep', amount: 40000 },
    { month: 'Oct', amount: 75000 },
    { month: 'Nov', amount: 38000 },
    { month: 'Dec', amount: 39000 },
  ],
  '2025': [
    { month: 'Jan', amount: 18000 },
    { month: 'Feb', amount: 25000 },
    { month: 'Mar', amount: 50000 },
    { month: 'Apr', amount: 28000 },
    { month: 'May', amount: 30000 },
    { month: 'Jun', amount: 34000 },
    { month: 'Jul', amount: 65000 },
    { month: 'Aug', amount: 31000 },
    { month: 'Sep', amount: 35000 },
    { month: 'Oct', amount: 60000 },
    { month: 'Nov', amount: 32000 },
    { month: 'Dec', amount: 33000 },
  ]
};

export default function MonthlyIncomeChart({
  data = null,
  selectedPeriod: initialPeriod = 'This Year',
  onPeriodChange
}) {
  const [period, setPeriod] = useState(initialPeriod);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const periods = ['This Year', '2026', '2025'];

  useEffect(() => {
    if (initialPeriod) {
      setPeriod(initialPeriod);
    }
  }, [initialPeriod]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const chartData = (data && data.length > 0 && period === 'This Year')
    ? data
    : (DEFAULT_INCOME_TRENDS[period] || DEFAULT_INCOME_TRENDS['This Year']);

  const handleSelectPeriod = (newPeriod) => {
    setPeriod(newPeriod);
    setDropdownOpen(false);
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-3 shadow-xl backdrop-blur-md z-50">
          <p className="text-xs font-semibold text-[#F1F5F4] mb-1.5">{label}</p>
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-[#A5B4B8]">
              <span className="w-2 h-2 rounded-full bg-[#35E9A0]"></span>
              Income:
            </span>
            <span className="font-semibold text-[#35E9A0]">
              {formatCurrency(payload[0]?.value || 0)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight">
          Monthly Income Trend
        </h3>

        {/* Period Selector Dropdown */}
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
            <div className="absolute right-0 mt-1 w-28 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
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

      {/* Vertical Bar Chart */}
      <div className="w-full h-[220px] sm:h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            barCategoryGap={12}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#24363B"
              vertical={false}
              opacity={0.6}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71848A', fontSize: 11 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71848A', fontSize: 11 }}
              tickFormatter={(v) => (v === 0 ? '0' : `${Math.round(v / 1000)}K`)}
              domain={[0, 100000]}
              ticks={[0, 20000, 40000, 60000, 80000, 100000]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
            />
            <Bar
              dataKey="amount"
              fill="#35E9A0"
              radius={[4, 4, 0, 0]}
              maxBarSize={18}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
