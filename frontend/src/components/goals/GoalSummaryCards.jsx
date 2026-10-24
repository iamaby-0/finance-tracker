import React from 'react';
import { Target, PiggyBank, Coins, TrendingUp } from 'lucide-react';

export default function GoalSummaryCards({ summary, loading }) {
  const formatINR = (val) => {
    if (typeof val === 'number') {
      return `₹${val.toLocaleString('en-IN')}`;
    }
    if (typeof val === 'string' && !val.startsWith('₹') && !isNaN(Number(val))) {
      return `₹${Number(val).toLocaleString('en-IN')}`;
    }
    return val;
  };

  const totalGoals = summary?.totalGoals !== undefined ? summary.totalGoals : 5;
  const activeGoals = summary?.activeGoals !== undefined ? summary.activeGoals : 3;
  const completedGoals = summary?.completedGoals !== undefined ? summary.completedGoals : 2;
  const totalTarget = summary?.totalTargetAmount !== undefined ? formatINR(summary.totalTargetAmount) : '₹18,50,000';
  const totalSaved = summary?.totalSaved !== undefined ? formatINR(summary.totalSaved) : '₹7,25,000';
  const savedPct = summary?.savedPercentage !== undefined ? `${summary.savedPercentage}%` : '39%';
  const onTrackCount = summary?.onTrackCount !== undefined ? summary.onTrackCount : 3;

  const cards = [
    {
      id: 'total-goals',
      icon: Target,
      iconBg: 'bg-[#123D32]',
      iconColor: 'text-[#35E9A0]',
      label: 'Total Goals',
      value: `${totalGoals}`,
      subtext: `${activeGoals} active • ${completedGoals} completed`,
      type: 'bars-mint'
    },
    {
      id: 'target-amount',
      icon: PiggyBank,
      iconBg: 'bg-[#2A1A40]',
      iconColor: 'text-[#B18AFF]',
      label: 'Total Target Amount',
      value: totalTarget,
      subtext: 'Across all goals',
      type: 'ring-teal'
    },
    {
      id: 'total-saved',
      icon: Coins,
      iconBg: 'bg-[#18384D]',
      iconColor: 'text-[#45B7F5]',
      label: 'Total Saved',
      value: totalSaved,
      subtext: `${savedPct} of target`,
      subtextColor: 'text-[#35E9A0]',
      type: 'bars-blue'
    },
    {
      id: 'on-track',
      icon: TrendingUp,
      iconBg: 'bg-[#382D12]',
      iconColor: 'text-[#F6C85F]',
      label: 'On Track',
      value: `${onTrackCount} / ${totalGoals}`,
      subtext: 'Keep going!',
      type: 'ring-mint'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-[#121E22] border border-[#24363B] animate-pulse p-4" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4.5 hover:border-[#35E9A0]/30 transition-all duration-200 shadow-sm flex items-center justify-between"
          >
            {/* Left Content */}
            <div className="space-y-1.5 min-w-0 pr-2">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${card.iconColor}`} />
                </div>
                <span className="text-xs text-[#A5B4B8] font-medium tracking-tight truncate">
                  {card.label}
                </span>
              </div>

              <div className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight truncate pt-0.5">
                {card.value}
              </div>

              <div className={`text-[11px] font-medium truncate ${card.subtextColor || 'text-[#71848A]'}`}>
                {card.subtext}
              </div>
            </div>

            {/* Right Mini Graphic */}
            <div className="shrink-0 pl-1">
              {card.type === 'bars-mint' && (
                <div className="flex items-end gap-1 h-7">
                  <span className="w-1.5 h-3 bg-[#35E9A0] rounded-xs" />
                  <span className="w-1.5 h-5 bg-[#35E9A0] rounded-xs" />
                  <span className="w-1.5 h-7 bg-[#35E9A0] rounded-xs" />
                  <span className="w-1.5 h-4 bg-[#35E9A0] rounded-xs" />
                </div>
              )}

              {card.type === 'bars-blue' && (
                <div className="flex items-end gap-1 h-7">
                  <span className="w-1.5 h-2.5 bg-[#45B7F5] rounded-xs" />
                  <span className="w-1.5 h-4 bg-[#45B7F5] rounded-xs" />
                  <span className="w-1.5 h-5.5 bg-[#45B7F5] rounded-xs" />
                  <span className="w-1.5 h-7 bg-[#45B7F5] rounded-xs" />
                </div>
              )}

              {card.type === 'ring-teal' && (
                <div className="w-8 h-8 relative flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path
                      className="text-[#18272C]"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#20D6C7]"
                      strokeDasharray="75, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
              )}

              {card.type === 'ring-mint' && (
                <div className="w-8 h-8 relative flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path
                      className="text-[#18272C]"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#35E9A0]"
                      strokeDasharray="60, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
