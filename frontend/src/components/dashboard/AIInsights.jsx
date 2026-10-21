import React from 'react';
import {
  Lightbulb,
  TrendingUp,
  Target,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function AIInsights({
  insights = null,
  onViewAll,
  onActionClick
}) {
  // Reference insights matching UI reference exactly
  const primaryInsight = {
    title: 'You spent 28% more on food this month',
    description:
      'Your food expenses are higher than last month. Consider setting a budget limit for dining out.',
    icon: Lightbulb,
    iconBg: 'bg-[#382F1B]',
    iconColor: 'text-[#F6C85F]'
  };

  const secondaryInsight = {
    title: 'Good Saving Trend',
    description: 'Your savings have increased by 12% this month.',
    icon: TrendingUp,
    iconBg: 'bg-[#123D32]',
    iconColor: 'text-[#35E9A0]'
  };

  const thirdInsight = {
    title: 'Budget Suggestion',
    description: 'Consider reducing shopping expenses by 15%.',
    icon: Target,
    iconBg: 'bg-[#3D1A22]',
    iconColor: 'text-[#FF667A]'
  };

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          {/* Purple AI chip */}
          <div className="w-6 h-6 rounded-md bg-[#2B1B3D] border border-[#B18AFF]/30 flex items-center justify-center text-[#B18AFF] shadow-xs">
            <span className="text-[10px] font-bold tracking-tight">AI</span>
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight">
            AI Financial Insights
          </h3>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] hover:underline transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Cards stack */}
      <div className="space-y-2.5">
        {/* Primary Insight (With Action Button) */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-[#18272C] border border-[#24363B] hover:border-[#F6C85F]/30 transition group flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl ${primaryInsight.iconBg} ${primaryInsight.iconColor} flex items-center justify-center shrink-0 border border-white/5 shadow-xs mt-0.5`}
            >
              <primaryInsight.icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-[13px] font-semibold text-[#F1F5F4] group-hover:text-[#35E9A0] transition leading-tight">
                {primaryInsight.title}
              </h4>
              <p className="text-[11px] text-[#A5B4B8] mt-1 leading-snug">
                {primaryInsight.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => onActionClick && onActionClick(primaryInsight)}
            className="w-7 h-7 rounded-full bg-[#121E22] border border-[#24363B] text-[#71848A] hover:text-[#35E9A0] hover:border-[#35E9A0]/50 flex items-center justify-center shrink-0 transition cursor-pointer shadow-xs"
            aria-label="View insight detail"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Secondary & Third Insights in 2-col grid on wide screens or stack */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Secondary: Good Saving Trend */}
          <div className="p-3 rounded-xl bg-[#18272C] border border-[#24363B] hover:border-[#35E9A0]/30 transition flex items-start gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg ${secondaryInsight.iconBg} ${secondaryInsight.iconColor} flex items-center justify-center shrink-0 border border-white/5 shadow-xs`}
            >
              <secondaryInsight.icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F1F5F4] leading-tight">
                {secondaryInsight.title}
              </h4>
              <p className="text-[11px] text-[#A5B4B8] mt-1 leading-snug">
                {secondaryInsight.description}
              </p>
            </div>
          </div>

          {/* Third: Budget Suggestion */}
          <div className="p-3 rounded-xl bg-[#18272C] border border-[#24363B] hover:border-[#FF667A]/30 transition flex items-start gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg ${thirdInsight.iconBg} ${thirdInsight.iconColor} flex items-center justify-center shrink-0 border border-white/5 shadow-xs`}
            >
              <thirdInsight.icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F1F5F4] leading-tight">
                {thirdInsight.title}
              </h4>
              <p className="text-[11px] text-[#A5B4B8] mt-1 leading-snug">
                {thirdInsight.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
