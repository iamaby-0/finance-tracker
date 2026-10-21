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

const DEFAULT_CHART_DATA = [
  { category: 'Food', budget: 15000, spent: 11850 },
  { category: 'Shoppin...', fullCategory: 'Shopping', budget: 10000, spent: 8500 },
  { category: 'Transpor...', fullCategory: 'Transport', budget: 8000, spent: 5930 },
  { category: 'Bills', fullCategory: 'Bills & Utilities', budget: 7000, spent: 6200 },
  { category: 'Entertai...', fullCategory: 'Entertainment', budget: 5000, spent: 3800 },
  { category: 'Health', fullCategory: 'Health & Fitness', budget: 4000, spent: 2400 },
  { category: 'Others', fullCategory: 'Others', budget: 5000, spent: 2970 },
];

export default function BudgetComparisonChart({
  data = null,
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

  const chartData = (data && data.length > 0) ? data : DEFAULT_CHART_DATA;

  const handleSelectPeriod = (newPeriod) => {
    setPeriod(newPeriod);
    setDropdownOpen(false);
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const budgetVal = payload.find((p) => p.dataKey === 'budget')?.value || 0;
      const spentVal = payload.find((p) => p.dataKey === 'spent')?.value || 0;
      const remainingVal = Math.max(budgetVal - spentVal, 0);
      const fullName = payload[0]?.payload?.fullCategory || label;

      return (
        <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-3 shadow-xl backdrop-blur-md z-50">
          <p className="text-xs font-semibold text-[#F1F5F4] mb-2">{fullName}</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[#A5B4B8]">
                <span className="w-2 h-2 rounded-full bg-[#35E9A0]"></span>
                Budget:
              </span>
              <span className="font-semibold text-[#35E9A0]">
                {formatCurrency(budgetVal)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[#A5B4B8]">
                <span className="w-2 h-2 rounded-full bg-[#FF667A]"></span>
                Spent:
              </span>
              <span className="font-semibold text-[#FF667A]">
                {formatCurrency(spentVal)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#24363B]/50">
              <span className="text-[#71848A]">Remaining:</span>
              <span className="font-semibold text-[#F1F5F4]">
                {formatCurrency(remainingVal)}
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
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight whitespace-nowrap">
            Budget vs Spending
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

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#35E9A0]" />
            <span className="text-[#A5B4B8] font-medium text-[11px]">Budget</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF667A]" />
            <span className="text-[#A5B4B8] font-medium text-[11px]">Spent</span>
          </div>
        </div>
      </div>

      {/* Grouped Bar Chart */}
      <div className="w-full h-[220px] sm:h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
            barGap={3}
            barCategoryGap={10}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#24363B"
              vertical={false}
              opacity={0.6}
            />
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71848A', fontSize: 10 }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71848A', fontSize: 10 }}
              tickFormatter={(v) => (v === 0 ? '0' : `${Math.round(v / 1000)}K`)}
              domain={[0, 20000]}
              ticks={[0, 5000, 10000, 15000, 20000]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
            />
            <Bar
              dataKey="budget"
              fill="#35E9A0"
              radius={[3, 3, 0, 0]}
              maxBarSize={12}
              animationDuration={600}
            />
            <Bar
              dataKey="spent"
              fill="#FF667A"
              radius={[3, 3, 0, 0]}
              maxBarSize={12}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
