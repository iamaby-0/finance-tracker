import React from 'react';
import { Utensils, ShoppingBag, Car } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_BUDGETS = [
  {
    category: 'Food & Dining',
    spent: 11850,
    budget: 15000,
    percentage: 79,
    icon: Utensils,
    iconColor: 'text-[#FF667A]',
    barColor: 'from-[#35E9A0] to-[#20D6C7]'
  },
  {
    category: 'Shopping',
    spent: 7620,
    budget: 10000,
    percentage: 76,
    icon: ShoppingBag,
    iconColor: 'text-[#B18AFF]',
    barColor: 'from-[#B18AFF] to-[#805AD5]'
  },
  {
    category: 'Transport',
    spent: 5930,
    budget: 8000,
    percentage: 74,
    icon: Car,
    iconColor: 'text-[#45B7F5]',
    barColor: 'from-[#45B7F5] to-[#20D6C7]'
  }
];

export default function BudgetProgress({
  budgets = null,
  onViewAll
}) {
  const displayList = budgets && budgets.length > 0 ? budgets : DEFAULT_BUDGETS;

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight">
          Monthly Budget Progress
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] hover:underline transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* 3 Budget Progress Rows */}
      <div className="space-y-3.5">
        {displayList.slice(0, 3).map((item, idx) => {
          const Icon = item.icon || Utensils;
          const percentage = item.percentage || Math.round((item.spent / item.budget) * 100);

          return (
            <div key={item.category || idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${item.iconColor || 'text-[#35E9A0]'}`} />
                  <span className="font-medium text-[#F1F5F4] text-[12px]">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#71848A]">
                    {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
                  </span>
                  <span className="font-semibold text-[#35E9A0] text-xs w-8 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Thin Horizontal Progress Bar */}
              <div className="w-full h-1.5 bg-[#18272C] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.barColor || 'from-[#35E9A0] to-[#20D6C7]'} transition-all duration-700`}
                  style={{ width: `${Math.min(100, percentage)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
