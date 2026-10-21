import React from 'react';
import { Wallet, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function BudgetSummaryCards({
  totalBudget = 70000,
  overallSpent = 47650,
  categoriesCount = 6,
  overBudgetCount = 1
}) {
  const usagePercentage = totalBudget > 0 ? Math.min(Math.round((overallSpent / totalBudget) * 100), 100) : 0;
  const remainingBudget = Math.max(totalBudget - overallSpent, 0);
  const remainingPercentage = totalBudget > 0 ? Math.max(100 - usagePercentage, 0) : 0;

  // Circular progress calculations for Card 2
  const strokeWidth = 5;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (usagePercentage / 100) * circumference;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Card 1: Total Budget */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 hover:border-[#35E9A0]/30 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-xl bg-[#123D32] border border-[#35E9A0]/20 flex items-center justify-center text-[#35E9A0] shadow-xs mb-3">
            <Wallet className="w-5 h-5 stroke-[2.2]" />
          </div>

          <p className="text-xs font-medium text-[#A5B4B8]">Total Budget</p>
          <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight mt-1">
            {formatCurrency(totalBudget)}
          </h3>
        </div>

        <div className="mt-3 pt-2 border-t border-[#24363B]/40">
          <p className="text-[11px] text-[#71848A]">
            Across {categoriesCount} {categoriesCount === 1 ? 'category' : 'categories'}
          </p>
        </div>
      </div>

      {/* Card 2: Overall Usage (Circular Progress) */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 hover:border-[#35E9A0]/30 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 52 52">
              <circle
                cx="26"
                cy="26"
                r={radius}
                className="stroke-[#18272C]"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <circle
                cx="26"
                cy="26"
                r={radius}
                className="stroke-[#35E9A0] transition-all duration-700 ease-out"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          <p className="text-xs font-medium text-[#A5B4B8]">Overall Usage</p>
          <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight mt-1">
            {usagePercentage}%
          </h3>
        </div>

        <div className="mt-3 pt-2 border-t border-[#24363B]/40">
          <p className="text-[11px] text-[#71848A]">
            {formatCurrency(overallSpent)} of {formatCurrency(totalBudget)}
          </p>
        </div>
      </div>

      {/* Card 3: Remaining Budget */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 hover:border-[#35E9A0]/30 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-xl bg-[#123D32] border border-[#35E9A0]/20 flex items-center justify-center text-[#35E9A0] shadow-xs mb-3">
            <TrendingUp className="w-5 h-5 stroke-[2.2]" />
          </div>

          <p className="text-xs font-medium text-[#A5B4B8]">Remaining Budget</p>
          <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight mt-1">
            {formatCurrency(remainingBudget)}
          </h3>
        </div>

        <div className="mt-3 pt-2 border-t border-[#24363B]/40">
          <p className="text-[11px] text-[#71848A]">
            {remainingPercentage}% remaining
          </p>
        </div>
      </div>

      {/* Card 4: Over Budget */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 hover:border-[#FF667A]/30 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-xl bg-[#3D1A22] border border-[#FF667A]/20 flex items-center justify-center text-[#FF667A] shadow-xs mb-3">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>

          <p className="text-xs font-medium text-[#A5B4B8]">Over Budget</p>
          <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight mt-1">
            {overBudgetCount} {overBudgetCount === 1 ? 'Category' : 'Categories'}
          </h3>
        </div>

        <div className="mt-3 pt-2 border-t border-[#24363B]/40">
          <p className="text-[11px] text-[#FF667A] font-medium">
            {overBudgetCount > 0 ? 'Needs attention' : 'All budgets on track'}
          </p>
        </div>
      </div>
    </div>
  );
}
