import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { ChevronDown } from 'lucide-react';

export default function SpendingInsightsCategory({
  expenseCategories,
  incomeCategories,
  totalExpenses = 42350,
  totalIncome = 85000,
  period = 'This Month',
  onPeriodChange
}) {
  const [mode, setMode] = useState('Expenses'); // 'Expenses' | 'Income'

  const defaultExpenseData = [
    { name: 'Food & Dining', amount: 15200, percentage: 28, color: '#FF5268' },
    { name: 'Shopping', amount: 9800, percentage: 18, color: '#A855F7' },
    { name: 'Transport', amount: 7600, percentage: 14, color: '#06B6D4' },
    { name: 'Bills & Utilities', amount: 6500, percentage: 12, color: '#F59E0B' },
    { name: 'Entertainment', amount: 5400, percentage: 10, color: '#3B82F6' },
    { name: 'Health & Fitness', amount: 4300, percentage: 8, color: '#EC4899' },
    { name: 'Others', amount: 5400, percentage: 10, color: '#64748B' }
  ];

  const defaultIncomeData = [
    { name: 'Salary', amount: 70000, percentage: 82, color: '#35E9A0' },
    { name: 'Freelance', amount: 15000, percentage: 18, color: '#45B7F5' }
  ];

  const currentData =
    mode === 'Expenses'
      ? expenseCategories && expenseCategories.length > 0
        ? expenseCategories
        : defaultExpenseData
      : incomeCategories && incomeCategories.length > 0
      ? incomeCategories
      : defaultIncomeData;

  const currentTotal = mode === 'Expenses' ? totalExpenses : totalIncome;

  const formatINR = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

  const formatYAxis = (val) => {
    if (val >= 1000) return `${val / 1000}K`;
    return val;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#18272C] border border-[#24363B] rounded-xl p-2.5 shadow-xl text-xs">
          <p className="font-semibold text-[#F1F5F4]">{data.name}</p>
          <p className="text-[#35E9A0] font-bold mt-0.5">{formatINR(data.amount)}</p>
          <p className="text-[10px] text-[#71848A] mt-0.5">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#24363B]/40">
        <h3 className="text-sm sm:text-base font-bold text-[#F1F5F4] tracking-tight">
          Spending Insights by Category
        </h3>

        <div className="flex items-center gap-2.5">
          {/* Segmented Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-[#0B1114] border border-[#24363B]">
            <button
              onClick={() => setMode('Expenses')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'Expenses'
                  ? 'bg-[#15372F] text-[#35E9A0] border border-[#35E9A0]/30 shadow-xs'
                  : 'text-[#71848A] hover:text-[#A5B4B8]'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setMode('Income')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'Income'
                  ? 'bg-[#15372F] text-[#35E9A0] border border-[#35E9A0]/30 shadow-xs'
                  : 'text-[#71848A] hover:text-[#A5B4B8]'
              }`}
            >
              Income
            </button>
          </div>

          {/* Period Dropdown */}
          <div className="relative">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18272C] border border-[#24363B] text-xs font-medium text-[#F1F5F4] hover:border-[#35E9A0]/40 transition">
              <span>{period}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#71848A]" />
            </button>
          </div>
        </div>
      </div>

      {/* Charts Row: Side-by-side (Bar Chart + Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center min-h-[220px]">
        {/* Left: Bar Chart (~55%) */}
        <div className="lg:col-span-7 h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#71848A', fontSize: 10 }}
                interval={0}
                tickFormatter={(val) => {
                  if (val.length > 10) return val.split(' ')[0];
                  return val;
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#71848A', fontSize: 10 }}
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={32}>
                {currentData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color || '#35E9A0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Donut Chart + Legend (~45%) */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Donut Chart with Center Text */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="amount"
                >
                  {currentData.map((entry, index) => (
                    <Cell key={`pie-${index}`} fill={entry.color || '#35E9A0'} stroke="#121E22" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xs font-bold text-[#F1F5F4] leading-tight">
                {formatINR(currentTotal)}
              </span>
              <span className="text-[9px] text-[#71848A] leading-tight">
                {mode === 'Expenses' ? 'Total Expenses' : 'Total Income'}
              </span>
            </div>
          </div>

          {/* Legend on Right */}
          <div className="flex-1 space-y-1.5 w-full max-h-[190px] overflow-y-auto scrollbar-thin pr-1">
            {currentData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color || '#35E9A0' }}
                  />
                  <span className="text-[#A5B4B8] truncate">{item.name}</span>
                </div>
                <span className="text-[#F1F5F4] font-medium shrink-0 ml-2">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
