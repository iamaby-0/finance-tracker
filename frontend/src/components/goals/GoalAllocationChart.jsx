import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function GoalAllocationChart({ allocation, totalTargetAmount = 1850000 }) {
  const defaultAllocation = [
    { name: 'Home', percentage: 54, targetAmount: 1000000, color: '#FF667A' },
    { name: 'Education', percentage: 27, targetAmount: 500000, color: '#B18AFF' },
    { name: 'Europe Trip', percentage: 16, targetAmount: 300000, color: '#45B7F5' },
    { name: 'Car', percentage: 3, targetAmount: 100000, color: '#35E9A0' },
    { name: 'Laptop', percentage: 1, targetAmount: 105000, color: '#F6C85F' }
  ];

  const data = allocation && allocation.length > 0 ? allocation : defaultAllocation;

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

      {/* Donut Chart + Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 h-[200px]">
        {/* Donut Chart */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={65}
                paddingAngle={3}
                dataKey="targetAmount"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`pie-${index}`}
                    fill={entry.color || '#35E9A0'}
                    stroke="#121E22"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xs font-bold text-[#F1F5F4] leading-tight">
              {formatINR(totalTargetAmount)}
            </span>
            <span className="text-[9px] text-[#71848A] leading-tight">
              Total Target
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 w-full overflow-y-auto max-h-[170px] scrollbar-thin pr-1">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color || '#35E9A0' }}
                />
                <span className="text-[#A5B4B8] truncate">
                  {item.name} ({item.percentage}%)
                </span>
              </div>
              <span className="text-[#F1F5F4] font-medium shrink-0 ml-2">
                {formatINR(item.targetAmount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
