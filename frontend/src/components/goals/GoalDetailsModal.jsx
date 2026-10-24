import React from 'react';
import {
  X,
  Target,
  Calendar,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  History,
  TrendingUp
} from 'lucide-react';

export default function GoalDetailsModal({
  goal,
  isOpen,
  onClose,
  onAddSavings
}) {
  if (!isOpen || !goal) return null;

  const formatINR = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  const progress = goal.targetAmount > 0
    ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
    : 0;

  // Calculate required monthly savings
  const now = new Date();
  const targetDate = new Date(goal.targetDate);
  const monthsDiff = Math.max(
    1,
    (targetDate.getFullYear() - now.getFullYear()) * 12 +
      (targetDate.getMonth() - now.getMonth())
  );
  const suggestedMonthly = remaining > 0 ? Math.round(remaining / monthsDiff) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#121E22] border border-[#24363B] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[calc(100dvh-1.5rem)] my-auto overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#24363B]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#123D32] flex items-center justify-center text-[#35E9A0]">
              <Target className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F1F5F4]">{goal.name}</h3>
              <p className="text-[11px] text-[#71848A]">
                {goal.category} • Target Date: {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description if present */}
        {goal.description && (
          <p className="text-xs text-[#A5B4B8] bg-[#18272C] p-3 rounded-xl border border-[#24363B] leading-relaxed">
            {goal.description}
          </p>
        )}

        {/* Progress Breakdown */}
        <div className="p-4 rounded-xl bg-[#18272C] border border-[#24363B] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#F1F5F4]">Savings Progress</span>
            <span className="text-sm font-bold text-[#35E9A0]">{progress}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[#101A1D] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#35E9A0] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#24363B]/60 text-center">
            <div>
              <span className="text-[10px] text-[#71848A] block">Saved</span>
              <span className="text-xs font-bold text-[#35E9A0]">
                {formatINR(goal.currentAmount)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#71848A] block">Target</span>
              <span className="text-xs font-bold text-[#F1F5F4]">
                {formatINR(goal.targetAmount)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#71848A] block">Remaining</span>
              <span className="text-xs font-bold text-[#FF667A]">
                {formatINR(remaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Pace & Smart Advice */}
        <div className="p-3.5 rounded-xl bg-[#18272C]/60 border border-[#24363B] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#35E9A0]" />
            <div>
              <p className="font-semibold text-[#F1F5F4]">Recommended Monthly Savings</p>
              <p className="text-[11px] text-[#71848A]">
                {remaining > 0
                  ? `Save ${formatINR(suggestedMonthly)}/month for next ${monthsDiff} months`
                  : 'Goal fully achieved!'}
              </p>
            </div>
          </div>

          {remaining > 0 && (
            <button
              onClick={() => {
                onClose();
                onAddSavings(goal);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Add Savings
            </button>
          )}
        </div>

        {/* Contribution History */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#F1F5F4] flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-[#A5B4B8]" />
            <span>Contribution History</span>
          </h4>

          {goal.contributions && goal.contributions.length > 0 ? (
            <div className="max-h-36 overflow-y-auto space-y-1.5 scrollbar-thin pr-1">
              {goal.contributions
                .slice()
                .reverse()
                .map((c, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#18272C] border border-[#24363B] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#35E9A0] block">
                        +{formatINR(c.amount)}
                      </span>
                      {c.note && (
                        <span className="text-[10px] text-[#A5B4B8] block truncate max-w-[200px]">
                          {c.note}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#71848A]">
                      {new Date(c.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-[11px] text-[#71848A] py-2 text-center bg-[#18272C] rounded-xl border border-[#24363B]">
              No individual contribution records logged yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
