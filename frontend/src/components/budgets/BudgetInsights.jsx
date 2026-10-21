import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

const DEFAULT_INSIGHTS = [
  {
    id: 'insight-1',
    title: "You've used 85% of your shopping budget",
    description: "You're close to your shopping limit. Consider reducing non-essential purchases.",
    icon: TrendingUp,
    iconBg: 'bg-[#3D1A22]',
    iconColor: 'text-[#FF667A]',
    hoverBorder: 'hover:border-[#FF667A]/30'
  },
  {
    id: 'insight-2',
    title: 'Good budget control',
    description: "You're on track with 4 out of 6 budgets this month. Keep it up!",
    icon: DollarSign,
    iconBg: 'bg-[#123D32]',
    iconColor: 'text-[#35E9A0]',
    hoverBorder: 'hover:border-[#35E9A0]/30'
  },
  {
    id: 'insight-3',
    title: 'Opportunity to save',
    description: "You're spending less on entertainment this month. Consider allocating the extra budget to your savings goal.",
    icon: Lightbulb,
    iconBg: 'bg-[#382818]',
    iconColor: 'text-[#F6C85F]',
    hoverBorder: 'hover:border-[#F6C85F]/30'
  }
];

export default function BudgetInsights({
  insights = null,
  onViewAll
}) {
  const items = (insights && insights.length > 0) ? insights : DEFAULT_INSIGHTS;

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#2B1B3D] border border-[#B18AFF]/30 flex items-center justify-center text-[#B18AFF] shadow-xs">
            <span className="text-[9px] font-bold tracking-tight">AI</span>
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight">
            Budget Insights
          </h3>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] hover:underline transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* 3 Stacked Cards */}
      <div className="space-y-2.5 flex-1 flex flex-col justify-between">
        {items.map((item) => {
          const Icon = item.icon || TrendingUp;

          return (
            <div
              key={item.id || item.title}
              className={`p-3 rounded-xl bg-[#18272C] border border-[#24363B] ${item.hoverBorder || 'hover:border-[#35E9A0]/30'} transition flex items-center justify-between gap-3 group cursor-pointer`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 border border-white/5 shadow-xs mt-0.5`}
                >
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-[#F1F5F4] leading-snug group-hover:text-[#35E9A0] transition truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#A5B4B8] mt-0.5 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Circular Action Arrow Button */}
              <div className="w-6 h-6 rounded-full bg-[#121E22] border border-[#24363B] flex items-center justify-center text-[#71848A] group-hover:text-[#35E9A0] group-hover:border-[#35E9A0]/30 group-hover:bg-[#15372F] transition shrink-0">
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
