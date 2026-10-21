import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_METHODS = [
  { name: 'UPI', value: 19058, percentage: 45, color: '#35E9A0' },
  { name: 'Credit Card', value: 12705, percentage: 30, color: '#B18AFF' },
  { name: 'Debit Card', value: 6353, percentage: 15, color: '#45B7F5' },
  { name: 'Cash', value: 4234, percentage: 10, color: '#F6C85F' }
];

export default function PaymentMethodsChart({
  methods = null,
  totalSpent = 42350
}) {
  const items = methods && methods.length > 0 ? methods : DEFAULT_METHODS;
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

      {/* Donut Chart with Centered Total Spent */}
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto my-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={items}
              cx="50%"
              cy="50%"
              innerRadius={46}
              outerRadius={68}
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

        {/* Centered Total Spent */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs sm:text-sm font-bold text-[#F1F5F4] tracking-tight">
            {formatCurrency(totalAmount)}
          </span>
          <span className="text-[9px] text-[#71848A] font-medium tracking-wider uppercase">
            Total Spent
          </span>
        </div>
      </div>

      {/* Legend List Underneath */}
      <div className="space-y-1.5 pt-1 border-t border-[#24363B]/40">
        {items.map((m, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs py-0.5 hover:bg-[#18272C]/40 px-1 rounded-md transition-colors"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: m.color }}
              />
              <span className="text-[#A5B4B8] text-[12px] truncate">
                {m.name}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
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
  );
}
