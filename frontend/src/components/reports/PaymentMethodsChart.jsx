import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export default function PaymentMethodsChart({
  methods = null,
  totalSpent = 0
}) {
  const items = Array.isArray(methods) ? methods : [];
  const totalAmount = totalSpent || items.reduce((s, m) => s + (m.value || 0), 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#18272C] border border-[#24363B] rounded-xl px-3 py-2 shadow-2xl text-xs z-50">
          <p className="font-semibold text-[#F1F5F4] flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: data.color }}
            />
            {data.name}
          </p>
          <p className="text-[#35E9A0] font-bold mt-1">
            {formatCurrency(data.value)}{' '}
            <span className="text-[#71848A] font-normal">({data.percentage}%)</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 flex flex-col justify-between h-full shadow-sm">
      {/* Header Row */}
      <div>
        <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
          Payment Methods
        </h3>
        <p className="text-xs text-[#71848A] mt-0.5">
          Expenses by payment method
        </p>
      </div>

      {/* Donut Chart & Legend or Empty State */}
      {items.length === 0 || totalAmount === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center my-auto">
          <p className="text-xs text-[#71848A]">No payment method data available.</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto">
          {/* Donut Chart */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={items}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={64}
                  paddingAngle={2.5}
                  dataKey="value"
                  stroke="none"
                >
                  {items.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex-1 w-full space-y-1.5">
            {items.map((m, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-0.5 hover:bg-[#18272C]/40 px-1.5 rounded-md transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: m.color }}
                  />
                  <span className="text-[#A5B4B8] truncate text-[12px]">
                    {m.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-[#71848A] text-[11px] w-7 text-right">
                    {m.percentage}%
                  </span>
                  <span className="font-semibold text-[#F1F5F4] text-[12px] w-14 text-right">
                    {formatCurrency(m.value)}
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
