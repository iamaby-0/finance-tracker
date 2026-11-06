import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Plane, Plus } from 'lucide-react';
import { formatCurrency, calculatePercentage } from '../../utils/formatters';

export default function FinancialGoals({
  goals = [],
  onViewAll,
  onAddGoal
}) {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate('/goals');
    }
  };

  const hasGoals = Array.isArray(goals) && goals.length > 0;
  const goal = hasGoals ? goals[0] : null;
  const savedAmount = goal ? Number(goal.currentAmount || goal.saved || 0) : 0;
  const targetAmount = goal ? Number(goal.targetAmount || goal.target || 0) : 0;
  const percentage = calculatePercentage(savedAmount, targetAmount);

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight">
          Financial Goals
        </h3>
        <button
          onClick={handleViewAll}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] hover:underline transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {!hasGoals ? (
        <div className="py-6 flex flex-col items-center justify-center text-center my-auto">
          <div className="w-9 h-9 rounded-xl bg-[#18272C] border border-[#24363B] flex items-center justify-center text-[#71848A] mb-2">
            <Target className="w-4 h-4 text-[#20D6C7]" />
          </div>
          <p className="text-xs font-semibold text-[#F1F5F4]">No active goals</p>
          <p className="text-[11px] text-[#71848A] mt-0.5 mb-2.5">Set a savings target to track your progress.</p>
          <button
            onClick={() => {
              if (onAddGoal) onAddGoal();
              else navigate('/goals');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18272C] border border-[#24363B] hover:border-[#20D6C7]/50 text-xs font-medium text-[#20D6C7] transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Goal</span>
          </button>
        </div>
      ) : (
        /* Goal Card */
        <div className="p-3 sm:p-3.5 rounded-xl bg-[#18272C] border border-[#24363B] hover:border-[#20D6C7]/30 transition group my-auto">
          <div className="flex items-center justify-between mb-2">
            {/* Icon & Title */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#12323D] border border-[#20D6C7]/20 flex items-center justify-center text-[#20D6C7] shadow-xs">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F1F5F4] leading-tight">
                  {goal.title || goal.name}
                </h4>
                <p className="text-[11px] text-[#71848A] mt-0.5">
                  Target: {formatCurrency(targetAmount)}
                </p>
              </div>
            </div>

            {/* Percentage Badge */}
            <span className="text-xs font-bold text-[#20D6C7] bg-[#12323D] border border-[#20D6C7]/30 px-2 py-0.5 rounded-md shadow-xs">
              {percentage}%
            </span>
          </div>

          {/* Progress Bar Container */}
          <div className="h-1.5 w-full bg-[#121E22] rounded-full overflow-hidden my-2">
            <div
              className="h-full bg-[#20D6C7] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(32,214,199,0.5)]"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Saved & Remaining Amounts */}
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="text-[#A5B4B8]">
              Saved:{' '}
              <span className="font-semibold text-[#F1F5F4]">
                {formatCurrency(savedAmount)}
              </span>
            </span>
            <span className="text-[#71848A]">
              Remaining:{' '}
              <span className="font-semibold text-[#F1F5F4]">
                {formatCurrency(Math.max(0, targetAmount - savedAmount))}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
