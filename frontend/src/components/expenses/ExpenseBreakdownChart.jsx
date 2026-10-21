import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_BREAKDOWN_DATA = {
  Daily: [
    { label: '1 Oct', amount: 1450 },
    { label: '5 Oct', amount: 890 },
    { label: '10 Oct', amount: 3200 },
    { label: '15 Oct', amount: 2100 },
    { label: '20 Oct', amount: 4850 },
    { label: '25 Oct', amount: 1650 },
    { label: '31 Oct', amount: 980 }
  ],
  Weekly: [
    { label: 'Week 1', amount: 9800 },
    { label: 'Week 2', amount: 12450 },
    { label: 'Week 3', amount: 11200 },
    { label: 'Week 4', amount: 8900 }
  ],
  Monthly: [
    { label: 'Jun', amount: 38000 },
    { label: 'Jul', amount: 31000 },
    { label: 'Aug', amount: 29000 },
    { label: 'Sep', amount: 34500 },
    { label: 'Oct', amount: 42350 }
  ]
};

export default function ExpenseBreakdownChart({ data = null }) {
  const [activeTab, setActiveTab] = useState('Daily'); // 'Daily' | 'Weekly' | 'Monthly'

  const chartData =
    data && data[activeTab] && data[activeTab].length > 0
      ? data[activeTab]
      : DEFAULT_BREAKDOWN_DATA[activeTab];

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#18272C] border border-[#24363B] p-2.5 rounded-xl shadow-xl">
          <p className="text-xs font-semibold text-[#A5B4B8] mb-1">{label}</p>
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
      {/* Header Row: Title & Segmented Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
            Expense Breakdown
          </h3>
          <p className="text-xs text-[#71848A] mt-0.5">
            Spending velocity over time
          </p>
        </div>

        {/* Segmented Control (Daily, Weekly, Monthly) */}
        <div className="inline-flex p-1 rounded-xl bg-[#18272C] border border-[#24363B]">
          {['Daily', 'Weekly', 'Monthly'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-[#123D32] text-[#35E9A0] font-bold shadow-xs'
                    : 'text-[#A5B4B8] hover:text-[#F1F5F4]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Area / Line Chart Container */}
      <div className="w-full h-[220px] mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="breakdownGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF667A" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#FF667A" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#24363B"
              vertical={false}
              opacity={0.6}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71848A', fontSize: 11 }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71848A', fontSize: 11 }}
              tickFormatter={(v) => (v === 0 ? '0' : `${Math.round(v / 1000)}K`)}
              dx={-4}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#FF667A', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#FF667A"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#breakdownGrad)"
              dot={{ r: 3.5, fill: '#FF667A', stroke: '#121E22', strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: '#FF8A48', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
