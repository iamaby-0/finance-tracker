import React, { useState, useRef, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_TREND_DATA = [
  { month: 'Jan', income: 24000, expenses: 14000, balance: 10000 },
  { month: 'Feb', income: 30000, expenses: 16000, balance: 14000 },
  { month: 'Mar', income: 27000, expenses: 18000, balance: 9000 },
  { month: 'Apr', income: 32000, expenses: 20000, balance: 12000 },
  { month: 'May', income: 34000, expenses: 19000, balance: 15000 },
  { month: 'Jun', income: 38000, expenses: 22000, balance: 16000 },
  { month: 'Jul', income: 36000, expenses: 21000, balance: 15000 },
  { month: 'Aug', income: 45000, expenses: 24000, balance: 21000 },
  { month: 'Sep', income: 39000, expenses: 23000, balance: 16000 },
  { month: 'Oct', income: 44000, expenses: 22000, balance: 22000 },
  { month: 'Nov', income: 38000, expenses: 21000, balance: 17000 },
  { month: 'Dec', income: 32000, expenses: 20000, balance: 12000 }
];

export default function IncomeExpenseTrendChart({
  data = null,
  selectedPeriod = 'This Year',
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

  const chartData = data && data.length > 0 ? data : DEFAULT_TREND_DATA;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#18272C] border border-[#24363B] rounded-xl px-3.5 py-2.5 shadow-2xl text-xs z-50">
          <p className="font-semibold text-[#F1F5F4] mb-1.5 border-b border-[#24363B] pb-1">
            {label} 2026
          </p>
          {payload.map((entry, index) => {
            const isIncome = entry.dataKey === 'income';
            const isExpenses = entry.dataKey === 'expenses';
            const color = isIncome ? '#35E9A0' : isExpenses ? '#FF667A' : '#F1F5F4';
            const labelName = isIncome ? 'Income' : isExpenses ? 'Expenses' : 'Balance';
            return (
              <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4 py-0.5">
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
      {/* Header Row: Title, Inline Legends, and Period Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
            Income vs Expenses Trend
          </h3>
        </div>

        <div className="flex items-center flex-wrap gap-4">
          {/* Inline Legend */}
          <div className="flex items-center gap-3 text-xs text-[#A5B4B8]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#35E9A0]" />
              <span>Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF667A]" />
              <span>Expenses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F1F5F4]" />
              <span>Balance</span>
            </div>
          </div>

          {/* Period Selector Dropdown */}
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
                {['This Year', '2026', '2025'].map((p) => (
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
      </div>

      {/* Recharts ComposedChart with Bars & Line */}
      <div className="w-full h-[250px] sm:h-[270px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            barGap={4}
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
              ticks={[0, 10000, 20000, 30000, 40000, 50000]}
              domain={[0, 50000]}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Income Bar (Mint Green) */}
            <Bar
              dataKey="income"
              fill="#35E9A0"
              radius={[3, 3, 0, 0]}
              barSize={8}
            />
            {/* Expense Bar (Coral Red) */}
            <Bar
              dataKey="expenses"
              fill="#FF667A"
              radius={[3, 3, 0, 0]}
              barSize={8}
            />
            {/* Balance Line (White with circular dots) */}
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#F1F5F4"
              strokeWidth={1.75}
              dot={{ r: 2.5, fill: '#F1F5F4', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#4FFFB0' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
