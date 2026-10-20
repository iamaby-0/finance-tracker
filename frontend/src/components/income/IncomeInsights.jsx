import React from 'react';
import { TrendingUp, DollarSign, Lightbulb } from 'lucide-react';

export default function IncomeInsights({
  insights = null
}) {
  const defaultInsights = [
    {
      id: 'insight-1',
      title: 'Income increased by 8.2%',
      description: 'Your income is higher than last month. Keep up the good work!',
      icon: TrendingUp,
      iconBg: 'bg-[#123D32]',
      iconColor: 'text-[#35E9A0]',
      hoverBorder: 'hover:border-[#35E9A0]/30'
    },
    {
      id: 'insight-2',
      title: 'Salary is your main source',
      description: '82% of your income comes from salary. Consider diversifying your income.',
      icon: DollarSign,
      iconBg: 'bg-[#182C3D]',
      iconColor: 'text-[#45B7F5]',
      hoverBorder: 'hover:border-[#45B7F5]/30'
    },
    {
      id: 'insight-3',
      title: 'Opportunity',
      description: 'You can explore freelance or side income to increase your earnings.',
      icon: Lightbulb,
      iconBg: 'bg-[#382F1B]',
      iconColor: 'text-[#F6C85F]',
      hoverBorder: 'hover:border-[#F6C85F]/30'
    }
  ];

  const items = insights && insights.length > 0 ? insights : defaultInsights;

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3.5">
        <div className="w-6 h-6 rounded-md bg-[#2B1B3D] border border-[#B18AFF]/30 flex items-center justify-center text-[#B18AFF] shadow-xs">
          <span className="text-[10px] font-bold tracking-tight">AI</span>
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight">
          Income Insights
        </h3>
      </div>

      {/* 3 Insight Cards in a Row on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {items.map((item) => {
          const Icon = item.icon || TrendingUp;
          return (
            <div
              key={item.id || item.title}
              className={`p-3.5 rounded-xl bg-[#18272C] border border-[#24363B] ${item.hoverBorder || 'hover:border-[#35E9A0]/30'} transition flex items-start gap-3 group`}
            >
              <div
                className={`w-9 h-9 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 border border-white/5 shadow-xs mt-0.5`}
              >
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-[13px] font-semibold text-[#F1F5F4] leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#A5B4B8] mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
