import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { ChevronDown } from 'lucide-react';

export default function SavingsProgressChart({ data }) {
  const [period, setPeriod] = useState('Last 12 Months');

  const defaultData = [
    { month: 'Jan', totalSaved: 100000, targetLine: 200000 },
    { month: 'Feb', totalSaved: 180000, targetLine: 350000 },
    { month: 'Mar', totalSaved: 260000, targetLine: 500000 },
    { month: 'Apr', totalSaved: 340000, targetLine: 650000 },
    { month: 'May', totalSaved: 420000, targetLine: 800000 },
    { month: 'Jun', totalSaved: 510000, targetLine: 950000 },
    { month: 'Jul', totalSaved: 590000, targetLine: 1100000 },
    { month: 'Aug', totalSaved: 680000, targetLine: 1250000 },
    { month: 'Sep', totalSaved: 700000, targetLine: 1400000 },
    { month: 'Oct', totalSaved: 725000, targetLine: 1550000 },
    { month: 'Nov', totalSaved: 780000, targetLine: 1700000 },
    { month: 'Dec', totalSaved: 850000, targetLine: 1850000 }
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  const formatYAxis = (val) => {
    if (val >= 100000) return `${val / 100000}L`;
    if (val >= 1000) return `${val / 1000}K`;
    return val;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#18272C] border border-[#24363B] rounded-xl p-2.5 shadow-xl text-xs space-y-1">
          <p className="font-semibold text-[#F1F5F4]">{label}</p>
          {payload.map((item, idx) => (
            <p key={idx} className="flex items-center gap-1.5" style={{ color: item.color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[#A5B4B8]">{item.name}:</span>
              <span className="font-bold">₹{Number(item.value).toLocaleString('en-IN')}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4.5 sm:p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#24363B]/40">
        <div>
          <h3 className="text-sm font-bold text-[#F1F5F4] tracking-tight">
            Savings Progress Over Time
          </h3>
          <p className="text-[11px] text-[#71848A]">
            Track your goal savings growth
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4]">
          <span>{period}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#71848A]" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#35E9A0]" />
          <span className="text-[#A5B4B8]">Total Saved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 border-t border-dashed border-[#71848A]" />
          <span className="text-[#71848A]">Target Line</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[200px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#24363B" opacity={0.4} vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71848A', fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71848A', fontSize: 10 }}
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="totalSaved"
              name="Total Saved"
              stroke="#35E9A0"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#35E9A0', strokeWidth: 1, stroke: '#121E22' }}
              activeDot={{ r: 5, fill: '#4FFFB0' }}
            />
            <Line
              type="monotone"
              dataKey="targetLine"
              name="Target Line"
              stroke="#71848A"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
