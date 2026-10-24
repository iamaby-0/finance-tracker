import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

export default function ExpenseInsights({ insights = null }) {
  const navigate = useNavigate();

  const defaultInsights = [
    {
      id: 'insight-1',
      type: 'warning',
      icon: TrendingUp,
      iconBg: 'bg-[#3D1A22]',
      iconBorder: 'border-[#FF667A]/30',
      iconColor: 'text-[#FF667A]',
      title: 'Food expenses are 28% higher',
      description: 'You spent more on dining out this month. Consider setting a budget limit.'
    },
    {
      id: 'insight-2',
      type: 'positive',
      icon: ShieldCheck,
      iconBg: 'bg-[#123D32]',
      iconBorder: 'border-[#35E9A0]/30',
      iconColor: 'text-[#35E9A0]',
      title: 'Good control on utilities',
      description: 'Your utility expenses are 15% lower than last month.'
    },
    {
      id: 'insight-3',
      type: 'opportunity',
      icon: Lightbulb,
      iconBg: 'bg-[#332A12]',
      iconBorder: 'border-[#F6C85F]/30',
      iconColor: 'text-[#F6C85F]',
      title: 'Opportunity to save',
      description: "You're spending 18% more on shopping. Try to reduce non-essential purchases."
    }
  ];

  const list = insights && insights.length > 0 ? insights : defaultInsights;

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 shadow-lg flex flex-col justify-between h-full">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* AI Purple Badge */}
          <div className="w-5 h-5 rounded-md bg-[#B18AFF]/20 border border-[#B18AFF]/30 flex items-center justify-center text-[#B18AFF] text-[11px] font-bold">
            <Sparkles className="w-3 h-3" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
              Expense Insights
            </h3>
          </div>
        </div>

        {/* View All Link */}
        <button
          onClick={() => navigate('/ai-insights')}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] hover:underline transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* 3 Insight Cards */}
      <div className="space-y-2.5">
        {list.map((item) => {
          const Icon = item.icon || TrendingUp;

          return (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-[#18272C] border border-[#24363B] hover:border-[#35E9A0]/30 transition group flex items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                {/* Icon Container */}
                <div
                  className={`w-8 h-8 rounded-lg ${item.iconBg} border ${item.iconBorder} flex items-center justify-center ${item.iconColor} shrink-0 mt-0.5 shadow-xs`}
                >
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>

                {/* Text Content */}
                <div>
                  <h4 className="text-xs font-bold text-[#F1F5F4] leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#A5B4B8] mt-0.5 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Arrow Button */}
              <button
                onClick={() => navigate('/budgets')}
                className="w-7 h-7 rounded-full bg-[#121E22] hover:bg-[#203238] border border-[#24363B] text-[#A5B4B8] group-hover:text-[#35E9A0] flex items-center justify-center shrink-0 transition cursor-pointer"
                aria-label="View insight details"
              >
                <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
