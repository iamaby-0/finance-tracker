import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, ShoppingBag, Car, Zap, Tags } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_CATEGORY_LIMITS = [
  {
    id: 'cl-1',
    name: 'Food & Dining',
    spent: 11850,
    limit: 15000,
    percentage: 79,
    barColor: '#FF667A',
    iconBg: 'bg-[#E23744]',
    icon: UtensilsCrossed
  },
  {
    id: 'cl-2',
    name: 'Shopping',
    spent: 7620,
    limit: 10000,
    percentage: 76,
    barColor: '#B18AFF',
    iconBg: 'bg-[#7C3AED]',
    icon: ShoppingBag
  },
  {
    id: 'cl-3',
    name: 'Transport',
    spent: 5930,
    limit: 8000,
    percentage: 74,
    barColor: '#20D6C7',
    iconBg: 'bg-[#0284C7]',
    icon: Car
  },
  {
    id: 'cl-4',
    name: 'Bills & Utilities',
    spent: 5120,
    limit: 7000,
    percentage: 73,
    barColor: '#F6C85F',
    iconBg: 'bg-[#D97706]',
    icon: Zap
  }
];

export default function CategoryLimits({ limits = null }) {
  const navigate = useNavigate();

  const list =
    limits && limits.length > 0 ? limits : DEFAULT_CATEGORY_LIMITS;

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 shadow-lg flex flex-col justify-between h-full">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
            Category Limits
          </h3>
          <p className="text-xs text-[#71848A] mt-0.5">
            Budget threshold progress
          </p>
        </div>

        {/* View All Link */}
        <button
          onClick={() => navigate('/budgets')}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] hover:underline transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Limits List */}
      <div className="space-y-4">
        {list.map((item) => {
          const Icon = item.icon || Tags;
          const isOver = item.percentage >= 100;

          return (
            <div key={item.id || item.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                {/* Left: Icon & Category Name */}
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className={`w-6 h-6 rounded-md ${
                      item.iconBg || 'bg-[#18272C]'
                    } flex items-center justify-center text-white shrink-0 shadow-xs text-xs`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-[#F1F5F4] truncate max-w-[110px] sm:max-w-[140px]">
                    {item.name}
                  </span>
                </div>

                {/* Right: Spent / Limit & Percentage */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-xs font-bold text-[#F1F5F4]">
                    {formatCurrency(item.spent)}
                    <span className="font-normal text-[#71848A]">
                      {' '}/ {formatCurrency(item.limit)}
                    </span>
                  </span>
                  <span
                    className={`text-[11px] font-bold min-w-[34px] text-right ${
                      isOver ? 'text-[#FF667A]' : 'text-[#A5B4B8]'
                    }`}
                  >
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 rounded-full bg-[#18272C] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, item.percentage)}%`,
                    backgroundColor: item.barColor || '#FF667A'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
