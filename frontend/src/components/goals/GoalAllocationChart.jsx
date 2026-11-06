import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function GoalAllocationChart({ allocation, totalTargetAmount = 0 }) {
  const data = Array.isArray(allocation) ? allocation : [];

  const formatINR = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-[#18272C] border border-[#24363B] rounded-xl p-2.5 shadow-xl text-xs space-y-1">
          <p className="font-semibold text-[#F1F5F4]">{item.name}</p>
          <p className="text-[#35E9A0] font-bold">{formatINR(item.targetAmount)}</p>
          <p className="text-[10px] text-[#71848A]">{item.percentage}% of total target</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4.5 sm:p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
      {/* Header */}
      <div className="pb-2 border-b border-[#24363B]/40">
        <h3 className="text-sm font-bold text-[#F1F5F4] tracking-tight">
          Goal Allocation
        </h3>
        <p className="text-[11px] text-[#71848A]">
          Target amount distribution
        </p>
      </div>

      {/* Donut Chart + Legend or Empty state */}
      {data.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center my-auto">
          <p className="text-xs text-[#71848A]">No goal allocation data available.</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 h-[200px]">
          {/* Donut Chart */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={64}
                  paddingAngle={3}
                  dataKey="percentage"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xs font-bold text-[#F1F5F4] tracking-tight">
                {totalTargetAmount > 0 ? formatINR(totalTargetAmount) : '100%'}
              </span>
              <span className="text-[9px] text-[#71848A]">Allocated</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 w-full space-y-2 overflow-y-auto max-h-[190px] pr-1">
            {data.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[#A5B4B8] truncate text-[11px] font-medium">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-semibold text-[#F1F5F4] text-[11px]">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
