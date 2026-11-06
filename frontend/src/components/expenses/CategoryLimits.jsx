import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, ShoppingBag, Car, Zap, Tags } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function CategoryLimits({ limits = null }) {
  const navigate = useNavigate();

  const list = Array.isArray(limits) ? limits : [];

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

      {/* Limits List or Empty State */}
      <div className="space-y-4">
        {list.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#71848A]">
            No category limits set yet. Set up a budget to track limits.
          </div>
        ) : (
          list.map((item) => {
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
                      {formatCurrency(item.spent || 0)}
                      <span className="font-normal text-[#71848A]">
                        {' '}/ {formatCurrency(item.limit || 0)}
                      </span>
                    </span>
                    <span
                      className={`text-[11px] font-bold min-w-[34px] text-right ${
                        isOver ? 'text-[#FF667A]' : 'text-[#A5B4B8]'
                      }`}
                    >
                      {item.percentage || 0}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 rounded-full bg-[#18272C] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, item.percentage || 0)}%`,
                      backgroundColor: item.barColor || '#FF667A'
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
