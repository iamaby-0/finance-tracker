import React, { useState, useRef, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Utensils,
  ShoppingBag,
  Car,
  FileText,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const CATEGORY_CHIPS = [
  { id: 'Food & Dining', label: 'Food & Dining', icon: Utensils, key: 'Food' },
  { id: 'Shopping', label: 'Shopping', icon: ShoppingBag, key: 'Shopping' },
  { id: 'Transport', label: 'Transport', icon: Car, key: 'Transport' },
  { id: 'Bills', label: 'Bills', icon: FileText, key: 'Bills' },
  { id: 'Others', label: 'Others', icon: MoreHorizontal, key: 'Other' }
];

const DEFAULT_SERIES = {
  'Food & Dining': [
    { month: 'May', amount: 8500 },
    { month: 'Jun', amount: 11200 },
    { month: 'Jul', amount: 14500 },
    { month: 'Aug', amount: 10400 },
    { month: 'Sep', amount: 11800 },
    { month: 'Oct', amount: 14800 }
  ],
  Shopping: [
    { month: 'May', amount: 6200 },
    { month: 'Jun', amount: 8400 },
    { month: 'Jul', amount: 7600 },
    { month: 'Aug', amount: 9200 },
    { month: 'Sep', amount: 7100 },
    { month: 'Oct', amount: 8900 }
  ],
  Transport: [
    { month: 'May', amount: 4800 },
    { month: 'Jun', amount: 5200 },
    { month: 'Jul', amount: 5900 },
    { month: 'Aug', amount: 5400 },
    { month: 'Sep', amount: 6100 },
    { month: 'Oct', amount: 5930 }
  ],
  Bills: [
    { month: 'May', amount: 4500 },
    { month: 'Jun', amount: 4700 },
    { month: 'Jul', amount: 5300 },
    { month: 'Aug', amount: 5100 },
    { month: 'Sep', amount: 4900 },
    { month: 'Oct', amount: 5120 }
  ],
  Others: [
    { month: 'May', amount: 3200 },
    { month: 'Jun', amount: 3800 },
    { month: 'Jul', amount: 4100 },
    { month: 'Aug', amount: 3900 },
    { month: 'Sep', amount: 4400 },
    { month: 'Oct', amount: 4200 }
  ]
};

export default function CategoryTrendsChart({
  categoryData = null,
  selectedPeriod = 'Last 6 Months',
  onPeriodChange
}) {
  const [activeCategory, setActiveCategory] = useState('Food & Dining');
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

  const chartData =
    categoryData && categoryData[activeCategory]
      ? categoryData[activeCategory]
      : DEFAULT_SERIES[activeCategory] || DEFAULT_SERIES['Food & Dining'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#18272C] border border-[#24363B] rounded-xl px-3.5 py-2 shadow-2xl text-xs z-50">
          <p className="font-semibold text-[#F1F5F4]">{label} 2026</p>
          <p className="text-[#FF667A] font-bold mt-1">
            {activeCategory}: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 flex flex-col justify-between h-full shadow-sm">
      {/* Header Row: Title & Period Dropdown */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
          Category Trends
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

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 mb-2">
        {CATEGORY_CHIPS.map((chip) => {
          const Icon = chip.icon;
          const isActive = activeCategory === chip.id;

          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setActiveCategory(chip.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer flex-shrink-0 ${
                isActive
                  ? 'bg-[#2A161B] border border-[#FF667A] text-[#FF667A] shadow-xs'
                  : 'bg-[#18272C] border border-[#24363B] text-[#A5B4B8] hover:text-[#F1F5F4] hover:border-[#35E9A0]/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Smooth Area Chart in Coral-Red */}
      <div className="w-full h-[210px] sm:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="catTrendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF667A" stopOpacity="0.4" />
                <stop offset="95%" stopColor="#FF667A" stopOpacity="0.0" />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#FF667A"
              strokeWidth={2}
              fill="url(#catTrendGradient)"
              dot={{ r: 3, fill: '#FF667A', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#FF8A48' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
