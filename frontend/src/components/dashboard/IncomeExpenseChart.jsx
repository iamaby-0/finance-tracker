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

const CHART_DATA_SETS = {
  'This Year': [
    { month: 'Jan', income: 18000, expenses: 10000 },
    { month: 'Feb', income: 24000, expenses: 14000 },
    { month: 'Mar', income: 32000, expenses: 18000 },
    { month: 'Apr', income: 28000, expenses: 20000 },
    { month: 'May', income: 33000, expenses: 22000 },
    { month: 'Jun', income: 36000, expenses: 23000 },
    { month: 'Jul', income: 46000, expenses: 23000 },
    { month: 'Aug', income: 32000, expenses: 22000 },
    { month: 'Sep', income: 34000, expenses: 24000 },
    { month: 'Oct', income: 43000, expenses: 23000 },
    { month: 'Nov', income: 36000, expenses: 22000 },
    { month: 'Dec', income: 33000, expenses: 25000 },
  ],
  '2026': [
    { month: 'Jan', income: 18000, expenses: 10000 },
    { month: 'Feb', income: 24000, expenses: 14000 },
    { month: 'Mar', income: 32000, expenses: 18000 },
    { month: 'Apr', income: 28000, expenses: 20000 },
    { month: 'May', income: 33000, expenses: 22000 },
    { month: 'Jun', income: 36000, expenses: 23000 },
    { month: 'Jul', income: 46000, expenses: 23000 },
    { month: 'Aug', income: 32000, expenses: 22000 },
    { month: 'Sep', income: 34000, expenses: 24000 },
    { month: 'Oct', income: 43000, expenses: 23000 },
    { month: 'Nov', income: 36000, expenses: 22000 },
    { month: 'Dec', income: 33000, expenses: 25000 },
  ],
  '2025': [
    { month: 'Jan', income: 15000, expenses: 8000 },
    { month: 'Feb', income: 19000, expenses: 11000 },
    { month: 'Mar', income: 25000, expenses: 15000 },
    { month: 'Apr', income: 24000, expenses: 16000 },
    { month: 'May', income: 28000, expenses: 18000 },
    { month: 'Jun', income: 31000, expenses: 19000 },
    { month: 'Jul', income: 35000, expenses: 20000 },
    { month: 'Aug', income: 29000, expenses: 18000 },
    { month: 'Sep', income: 31000, expenses: 20000 },
    { month: 'Oct', income: 36000, expenses: 21000 },
    { month: 'Nov', income: 30000, expenses: 19000 },
    { month: 'Dec', income: 29000, expenses: 21000 },
  ]
};

export default function IncomeExpenseChart({
  data = null,
  selectedPeriod: initialPeriod = 'This Year',
  onPeriodChange
}) {
  const [period, setPeriod] = useState(initialPeriod);
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const periods = ['This Year', '2026', '2025'];

  // Sync if prop changes
  useEffect(() => {
    if (initialPeriod) {
      setPeriod(initialPeriod);
    }
  }, [initialPeriod]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPeriodDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine chart data for selected period
  const chartData = (data && data.length > 0 && period === 'This Year')
    ? data
    : (CHART_DATA_SETS[period] || CHART_DATA_SETS['This Year']);

  const handleSelectPeriod = (newPeriod) => {
    setPeriod(newPeriod);
    setPeriodDropdownOpen(false);
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-3 shadow-xl backdrop-blur-md z-50">
          <p className="text-xs font-semibold text-[#F1F5F4] mb-2">{label}</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[#A5B4B8]">
                <span className="w-2 h-2 rounded-full bg-[#35E9A0]"></span>
                Income:
              </span>
              <span className="font-semibold text-[#35E9A0]">
                {formatCurrency(payload[0]?.value || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[#A5B4B8]">
                <span className="w-2 h-2 rounded-full bg-[#FF667A]"></span>
                Expenses:
              </span>
              <span className="font-semibold text-[#FF667A]">
                {formatCurrency(payload[1]?.value || 0)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 h-full flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight">
          Income vs Expenses
        </h3>

        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#35E9A0]"></span>
              <span className="text-[#A5B4B8] font-medium">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF667A]"></span>
              <span className="text-[#A5B4B8] font-medium">Expenses</span>
            </div>
          </div>

          {/* Period Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setPeriodDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] hover:border-[#35E9A0]/50 transition cursor-pointer"
            >
              <span>{period}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#71848A] transition-transform duration-200 ${
                  periodDropdownOpen ? 'rotate-180 text-[#35E9A0]' : ''
                }`}
              />
            </button>

            {periodDropdownOpen && (
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
      </div>

      {/* Grouped Bar Chart */}
      <div className="w-full h-[210px] sm:h-[225px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={3}
            barCategoryGap={14}
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
              domain={[0, 50000]}
              ticks={[0, 10000, 20000, 30000, 40000, 50000]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
            />
            <Bar
              dataKey="income"
              fill="#35E9A0"
              radius={[4, 4, 0, 0]}
              maxBarSize={11}
              animationDuration={600}
            />
            <Bar
              dataKey="expenses"
              fill="#FF667A"
              radius={[4, 4, 0, 0]}
              maxBarSize={11}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
