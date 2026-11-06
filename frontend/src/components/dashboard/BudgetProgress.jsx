import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, ShoppingBag, Car, Target, Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const getCategoryIcon = (category = '') => {
  const cat = category.toLowerCase();
  if (cat.includes('food') || cat.includes('dining')) return { icon: Utensils, color: 'text-[#FF667A]' };
  if (cat.includes('shop')) return { icon: ShoppingBag, color: 'text-[#B18AFF]' };
  if (cat.includes('trans')) return { icon: Car, color: 'text-[#45B7F5]' };
  return { icon: Target, color: 'text-[#35E9A0]' };
};

export default function BudgetProgress({
  budgets = [],
  expenses = [],
  onViewAll,
  onSetBudget
}) {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate('/budgets');
    }
  };

  const displayList = Array.isArray(budgets) ? budgets : [];

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight">
          Monthly Budget Progress
        </h3>
        <button
          onClick={handleViewAll}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] hover:underline transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {displayList.length === 0 ? (
        <div className="py-6 flex flex-col items-center justify-center text-center my-auto">
          <div className="w-9 h-9 rounded-xl bg-[#18272C] border border-[#24363B] flex items-center justify-center text-[#71848A] mb-2">
            <Target className="w-4 h-4 text-[#35E9A0]" />
          </div>
          <p className="text-xs font-semibold text-[#F1F5F4]">No budgets set</p>
          <p className="text-[11px] text-[#71848A] mt-0.5 mb-2.5">Set monthly limits to keep spending on track.</p>
          {onSetBudget && (
            <button
              onClick={onSetBudget}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18272C] border border-[#24363B] hover:border-[#35E9A0]/50 text-xs font-medium text-[#35E9A0] transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Set Budget</span>
            </button>
          )}
        </div>
      ) : (
        /* 3 Budget Progress Rows */
        <div className="space-y-3.5">
          {displayList.slice(0, 3).map((item, idx) => {
            const { icon: Icon, color } = getCategoryIcon(item.category || '');
            const budgetAmount = Number(item.amount || item.budget) || 0;
            
            // Calculate real spending from expenses if passed
            let spent = Number(item.spent) || 0;
            if (expenses && expenses.length > 0) {
              const matched = expenses.filter(
                (e) => (e.category || '').toLowerCase() === (item.category || '').toLowerCase()
              );
              if (matched.length > 0) {
                spent = matched.reduce((s, e) => s + (Number(e.amount) || 0), 0);
              }
            }

            const percentage = budgetAmount > 0 ? Math.min(Math.round((spent / budgetAmount) * 100), 100) : 0;

            return (
              <div key={item._id || item.category || idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    <span className="font-medium text-[#F1F5F4] text-[12px]">
                      {item.category || item.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#A5B4B8]">
                    <span className="font-semibold text-[#F1F5F4]">
                      {formatCurrency(spent)}
                    </span>{' '}
                    / {formatCurrency(budgetAmount)}
                  </span>
                </div>

                {/* Progress Bar Container */}
                <div className="h-1.5 w-full bg-[#18272C] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentage >= 90 ? 'bg-[#FF667A]' : 'bg-[#35E9A0]'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
