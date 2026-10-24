import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, PiggyBank, Lightbulb, BarChart3, ArrowRight } from 'lucide-react';

export default function TopInsights({ insights, loading }) {
  const navigate = useNavigate();

  const iconMap = {
    TrendingUp,
    PiggyBank,
    Lightbulb,
    BarChart3
  };

  const defaultInsights = [
    {
      id: 'insight-1',
      badgeText: 'Higher Spending on Food & Dining',
      explanation: 'You spent 28% more on food & dining compared to last month. Consider setting a dining budget.',
      icon: 'TrendingUp',
      color: 'coral',
      actionText: 'View Details',
      route: '/expenses'
    },
    {
      id: 'insight-2',
      badgeText: 'Improved Savings Rate',
      explanation: 'Your savings rate increased by 6% this month. Keep maintaining your current spending habits!',
      icon: 'PiggyBank',
      color: 'mint',
      actionText: 'View Details',
      route: '/analytics'
    },
    {
      id: 'insight-3',
      badgeText: 'Opportunity to Save',
      explanation: 'You can save around ₹3,200 per month by reducing non-essential shopping and subscription costs.',
      icon: 'Lightbulb',
      color: 'blue',
      actionText: 'View Details',
      route: '/budgets'
    },
    {
      id: 'insight-4',
      badgeText: 'On Track with Budgets',
      explanation: 'You are within limits for 5 out of 8 budget categories. Great progress!',
      icon: 'BarChart3',
      color: 'purple',
      actionText: 'View Details',
      route: '/budgets'
    }
  ];

  const displayInsights = insights && insights.length > 0 ? insights : defaultInsights;

  const colorStyles = {
    coral: {
      iconBg: 'bg-[#3D1A22]',
      iconColor: 'text-[#FF667A]',
      buttonBg: 'hover:bg-[#FF667A]/10',
      actionText: 'text-[#FF667A]'
    },
    mint: {
      iconBg: 'bg-[#123D32]',
      iconColor: 'text-[#35E9A0]',
      buttonBg: 'hover:bg-[#35E9A0]/10',
      actionText: 'text-[#35E9A0]'
    },
    blue: {
      iconBg: 'bg-[#18384D]',
      iconColor: 'text-[#45B7F5]',
      buttonBg: 'hover:bg-[#45B7F5]/10',
      actionText: 'text-[#45B7F5]'
    },
    purple: {
      iconBg: 'bg-[#2A1A40]',
      iconColor: 'text-[#B18AFF]',
      buttonBg: 'hover:bg-[#B18AFF]/10',
      actionText: 'text-[#B18AFF]'
    }
  };

  return (
    <div className="space-y-3">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#F1F5F4] tracking-tight">
            Top Insights for You
          </h3>
          <p className="text-[11px] text-[#71848A]">
            Based on your spending patterns this month
          </p>
        </div>

        {/* AI Generated Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2A1A40] border border-[#B18AFF]/30 text-[#B18AFF] text-[10px] sm:text-[11px] font-semibold">
          <Sparkles className="w-3 h-3 text-[#B18AFF]" />
          <span>AI Generated</span>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {displayInsights.map((item, idx) => {
          const Icon = iconMap[item.icon] || TrendingUp;
          const style = colorStyles[item.color] || colorStyles.coral;

          return (
            <div
              key={item.id || idx}
              className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4 flex flex-col justify-between hover:border-[#35E9A0]/30 transition duration-200 shadow-sm"
            >
              <div>
                {/* Top Row: Icon Container */}
                <div className="flex items-start justify-between">
                  <div className={`w-8 h-8 rounded-xl ${style.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${style.iconColor}`} />
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-xs font-bold text-[#F1F5F4] mt-2.5 leading-snug">
                  {item.badgeText}
                </h4>

                {/* Explanation */}
                <p className="text-[11px] text-[#A5B4B8] mt-2 leading-relaxed">
                  • {item.explanation}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate(item.route || '/expenses')}
                className={`mt-4 w-full py-1.5 px-2.5 rounded-lg border border-[#24363B] ${style.actionText} ${style.buttonBg} text-[11px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer`}
              >
                <span>{item.actionText || 'View Details'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
