import React from 'react';
import { Plane, Plus } from 'lucide-react';
import { formatCurrency, calculatePercentage } from '../../utils/formatters';

const DEFAULT_GOAL = {
  id: 'goal-1',
  title: 'Trip to Goa',
  saved: 15000,
  target: 50000,
  icon: Plane
};

export default function FinancialGoals({
  goals = null,
  onViewAll,
  onAddGoal
}) {
  const goal = goals && goals.length > 0 ? goals[0] : DEFAULT_GOAL;
  const percentage = calculatePercentage(goal.saved, goal.target);
  const Icon = goal.icon || Plane;

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight">
          Financial Goals
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] hover:underline transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Goal Card */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-[#18272C] border border-[#24363B] hover:border-[#20D6C7]/30 transition group my-auto">
        <div className="flex items-center justify-between mb-2">
          {/* Icon & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#12323D] border border-[#20D6C7]/20 flex items-center justify-center text-[#20D6C7] shadow-xs">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F1F5F4] leading-tight">
                {goal.title}
              </h4>
              <p className="text-[11px] text-[#71848A] mt-0.5">
                {formatCurrency(goal.saved)} / {formatCurrency(goal.target)}
              </p>
            </div>
          </div>

          {/* Progress Percentage */}
          <span className="text-xs font-bold text-[#35E9A0]">
            {percentage}%
          </span>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="w-full h-1.5 bg-[#121E22] rounded-full overflow-hidden mt-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#20D6C7] to-[#35E9A0] transition-all duration-700"
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
