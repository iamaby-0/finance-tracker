import React, { useState, useRef, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_COMPARISON = [
  { month: 'Aug', income: 82000, expenses: 38000 },
  { month: 'Sep', income: 76000, expenses: 40000 },
  { month: 'Oct', income: 85000, expenses: 42350 }
];

export default function ExpenseComparisonChart({
  data = null,
  selectedPeriod = 'Last 3 Months',
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

  const chartData = data && data.length > 0 ? data : DEFAULT_COMPARISON;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#18272C] border border-[#24363B] rounded-xl px-3.5 py-2 shadow-2xl text-xs z-50">
          <p className="font-semibold text-[#F1F5F4] border-b border-[#24363B] pb-1 mb-1">
            {label} 2026
          </p>
          {payload.map((entry, index) => {
            const isIncome = entry.dataKey === 'income';
            const color = isIncome ? '#35E9A0' : '#FF667A';
            const labelName = isIncome ? 'Income' : 'Expenses';
            return (
              <div key={index} className="flex items-center justify-between gap-3 py-0.5">
                <span className="flex items-center gap-1.5 text-[#A5B4B8]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  {labelName}:
                </span>
                <span className="font-semibold text-[#F1F5F4]">
                  {formatCurrency(entry.value)}
                </span>
              </div>
            );
          })}
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
          Expense Comparison
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
              {['Last 3 Months', 'Last 6 Months', 'This Year'].map((p) => (
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

      {/* Inline Legend */}
      <div className="flex items-center justify-end gap-3 text-xs text-[#A5B4B8] mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#35E9A0]" />
          <span>Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF667A]" />
          <span>Expenses</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="w-full h-[180px] sm:h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            barGap={6}
          >
            <CartesianGrid stroke="#24363B" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#71848A"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#24363B' }}
            />
            <YAxis
              stroke="#71848A"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v === 0 ? '0' : `${Math.round(v / 1000)}K`)}
              ticks={[0, 20000, 40000, 60000, 80000, 100000]}
              domain={[0, 100000]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="income"
              fill="#35E9A0"
              radius={[4, 4, 0, 0]}
              barSize={14}
            />
            <Bar
              dataKey="expenses"
              fill="#FF667A"
              radius={[4, 4, 0, 0]}
              barSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
