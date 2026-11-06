import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Home, Plane, Target } from 'lucide-react';

export default function FinancialGoalsProgress({ goals }) {
  const navigate = useNavigate();

  const iconMap = {
    Car,
    Home,
    Plane,
    Target
  };

  const displayGoals = Array.isArray(goals) ? goals : [];

  const formatINR = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4 sm:p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#24363B]/40">
        <h3 className="text-sm font-bold text-[#F1F5F4] tracking-tight">
          Financial Goals Progress
        </h3>
        <button
          onClick={() => navigate('/goals')}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Goals List or Empty State */}
      <div className="space-y-3">
        {displayGoals.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#71848A]">
            No goals created yet. Set up a savings goal to track your progress.
          </div>
        ) : (
          displayGoals.map((goal) => {
            const Icon = iconMap[goal.icon] || Target;
            return (
              <div
                key={goal.id || goal._id || goal.name}
                className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#18272C]/50 hover:bg-[#18272C] transition border border-transparent hover:border-[#24363B]"
              >
                {/* Left Icon */}
                <div
                  className={`w-8 h-8 rounded-full ${
                    goal.iconBg || 'bg-[#18384D]'
                  } flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-4 h-4 ${goal.iconColor || 'text-[#45B7F5]'}`} />
                </div>

                {/* Goal Title & Progress Bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#F1F5F4] truncate">
                      {goal.name}
                    </span>
                    <span className="text-[11px] font-semibold text-[#A5B4B8]">
                      {goal.percentage || 0}%
                    </span>
                  </div>
                  {/* Progress track */}
                  <div className="w-full h-1.5 bg-[#101A1D] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#35E9A0] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, goal.percentage || 0))}%` }}
                    />
                  </div>
                </div>

                {/* Right Amounts */}
                <div className="text-right shrink-0">
                  <span className="text-[10px] sm:text-[11px] font-medium text-[#71848A]">
                    {formatINR(goal.currentAmount)} / {formatINR(goal.targetAmount)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
