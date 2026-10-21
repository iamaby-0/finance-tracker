import React, { useState, useRef, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_TREND = [
  { month: 'May', food: 8500, shopping: 6200, transport: 4800, bills: 4500, entertainment: 3200 },
  { month: 'Jun', food: 11200, shopping: 8400, transport: 5200, bills: 4700, entertainment: 3800 },
  { month: 'Jul', food: 14500, shopping: 7600, transport: 5900, bills: 5300, entertainment: 4100 },
  { month: 'Aug', food: 10400, shopping: 9200, transport: 5400, bills: 5100, entertainment: 3900 },
  { month: 'Sep', food: 11800, shopping: 7100, transport: 6100, bills: 4900, entertainment: 4400 },
  { month: 'Oct', food: 14800, shopping: 8900, transport: 5930, bills: 5120, entertainment: 4230 }
];

export default function CategorySpendingTrend({
  data = null,
  selectedPeriod = 'Last 6 Months',
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

  const chartData = data && data.length > 0 ? data : DEFAULT_TREND;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#18272C] border border-[#24363B] rounded-xl px-3.5 py-2.5 shadow-2xl text-xs z-50">
          <p className="font-semibold text-[#F1F5F4] border-b border-[#24363B] pb-1 mb-1.5">
            {label} 2026
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 text-[#A5B4B8]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-semibold text-[#F1F5F4]">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 flex flex-col justify-between h-full shadow-sm">
      {/* Header Row: Title, Subtitle, and Period Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
            Category Spending Trend
          </h3>
          <p className="text-xs text-[#71848A] mt-0.5">
            Compare category wise spending over time
          </p>
        </div>

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
            <div className="absolute right-0 mt-1 w-36 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-30 animate-in fade-in duration-100">
              {['Last 6 Months', 'Last 3 Months', 'This Year'].map((p) => (
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
      <div className="flex items-center flex-wrap gap-3 text-[11px] text-[#A5B4B8] my-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF667A]" />
          <span>Food & Dining</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#B18AFF]" />
          <span>Shopping</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#45B7F5]" />
          <span>Transport</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#F6C85F]" />
          <span>Bills & Utilities</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF6EA7]" />
          <span>Entertainment</span>
        </div>
      </div>

      {/* Multi-line Chart */}
      <div className="w-full h-[190px] sm:h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
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
              ticks={[0, 5000, 10000, 15000, 20000]}
              domain={[0, 20000]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              name="Food & Dining"
              dataKey="food"
              stroke="#FF667A"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#FF667A', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              name="Shopping"
              dataKey="shopping"
              stroke="#B18AFF"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#B18AFF', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              name="Transport"
              dataKey="transport"
              stroke="#45B7F5"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#45B7F5', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              name="Bills & Utilities"
              dataKey="bills"
              stroke="#F6C85F"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#F6C85F', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              name="Entertainment"
              dataKey="entertainment"
              stroke="#FF6EA7"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#FF6EA7', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
