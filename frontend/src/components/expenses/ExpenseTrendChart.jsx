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

const DEFAULT_EXPENSE_TRENDS = {
  'This Year': [
    { month: 'Jan', amount: 16000 },
    { month: 'Feb', amount: 28000 },
    { month: 'Mar', amount: 22000 },
    { month: 'Apr', amount: 26000 },
    { month: 'May', amount: 31000 },
    { month: 'Jun', amount: 48000 },
    { month: 'Jul', amount: 24000 },
    { month: 'Aug', amount: 29000 },
    { month: 'Sep', amount: 33000 },
    { month: 'Oct', amount: 42350 },
    { month: 'Nov', amount: 22000 },
    { month: 'Dec', amount: 19000 }
  ],
  '2026': [
    { month: 'Jan', amount: 16000 },
    { month: 'Feb', amount: 28000 },
    { month: 'Mar', amount: 22000 },
    { month: 'Apr', amount: 26000 },
    { month: 'May', amount: 31000 },
    { month: 'Jun', amount: 48000 },
    { month: 'Jul', amount: 24000 },
    { month: 'Aug', amount: 29000 },
    { month: 'Sep', amount: 33000 },
    { month: 'Oct', amount: 42350 },
    { month: 'Nov', amount: 22000 },
    { month: 'Dec', amount: 19000 }
  ],
  '2025': [
    { month: 'Jan', amount: 14000 },
    { month: 'Feb', amount: 22000 },
    { month: 'Mar', amount: 18000 },
    { month: 'Apr', amount: 21000 },
    { month: 'May', amount: 27000 },
    { month: 'Jun', amount: 39000 },
    { month: 'Jul', amount: 20000 },
    { month: 'Aug', amount: 25000 },
    { month: 'Sep', amount: 28000 },
    { month: 'Oct', amount: 36000 },
    { month: 'Nov', amount: 19000 },
    { month: 'Dec', amount: 17000 }
  ]
};

export default function ExpenseTrendChart({
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

  const chartData =
    data && Array.isArray(data) && data.length > 0
      ? data
      : DEFAULT_EXPENSE_TRENDS[period] || DEFAULT_EXPENSE_TRENDS['This Year'];

  const handleSelectPeriod = (p) => {
    setPeriod(p);
    setDropdownOpen(false);
    if (onPeriodChange) {
      onPeriodChange(p);
    }
  };

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#18272C] border border-[#24363B] p-2.5 rounded-xl shadow-xl">
          <p className="text-xs font-semibold text-[#A5B4B8] mb-1">{label} 2026</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF667A]" />
            <span className="text-xs font-bold text-[#F1F5F4]">
              {formatCurrency(payload[0].value)}
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
            Expenses Trend
          </h3>
          <p className="text-xs text-[#71848A] mt-0.5">
            Monthly spending across the year
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

      {/* Bar Chart Container */}
      <div className="w-full h-[250px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
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
              tickFormatter={(value) => {
                if (value === 0) return '0';
                return `${Math.round(value / 1000)}K`;
              }}
              dx={-4}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255, 102, 122, 0.08)' }}
            />
            <Bar
              dataKey="amount"
              fill="#FF667A"
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
