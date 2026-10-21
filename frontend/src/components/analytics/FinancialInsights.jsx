import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export default function FinancialInsights({ insights = null }) {
  const navigate = useNavigate();

  const defaultInsights = [
    {
      id: 1,
      icon: TrendingUp,
      iconBg: 'bg-[#2A161B]',
      iconBorder: 'border-[#FF667A]/30',
      iconColor: 'text-[#FF667A]',
      title: 'Your expenses increased by 12%',
      description: 'You spent more than last month. Consider reviewing your shopping expenses.',
      path: '/expenses'
    },
    {
      id: 2,
      icon: DollarSign,
      iconBg: 'bg-[#123D32]',
      iconBorder: 'border-[#35E9A0]/30',
      iconColor: 'text-[#35E9A0]',
      title: 'Savings rate improved',
      description: 'You saved 15% more compared to last month. Keep it up!',
      path: '/budgets'
    },
    {
      id: 3,
      icon: Lightbulb,
      iconBg: 'bg-[#2E2413]',
      iconBorder: 'border-[#F6C85F]/30',
      iconColor: 'text-[#F6C85F]',
      title: 'Top spending category',
      description: 'Food & Dining accounts for 28% of your total expenses this month.',
      path: '/expenses'
    }
  ];

  const items = insights && insights.length > 0 ? insights : defaultInsights;

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 flex flex-col justify-between h-full shadow-sm">
      {/* Header Row: Title & View All */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
          Financial Insights
        </h3>

        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* 3 Insight Cards */}
      <div className="space-y-2.5 flex-1 flex flex-col justify-between">
        {items.map((item, idx) => {
          const Icon = item.icon || TrendingUp;

          return (
            <div
              key={item.id || idx}
              onClick={() => item.path && navigate(item.path)}
              className="p-3 rounded-xl bg-[#18272C] border border-[#24363B] hover:border-[#35E9A0]/40 transition-all duration-200 flex items-center justify-between gap-3 group cursor-pointer"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border mt-0.5 shadow-xs ${
                    item.iconBg || 'bg-[#123D32]'
                  } ${item.iconBorder || 'border-[#35E9A0]/30'} ${
                    item.iconColor || 'text-[#35E9A0]'
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>

                <div className="min-w-0">
                  <h4 className="text-[13px] font-semibold text-[#F1F5F4] tracking-tight leading-snug group-hover:text-[#35E9A0] transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#71848A] mt-0.5 leading-snug line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Circle Button */}
              <div className="w-7 h-7 rounded-full bg-[#121E22] border border-[#24363B] group-hover:border-[#35E9A0] group-hover:bg-[#15372F] flex items-center justify-center text-[#71848A] group-hover:text-[#35E9A0] transition-all flex-shrink-0 shadow-xs">
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
