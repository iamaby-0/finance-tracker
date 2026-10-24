import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Home, PiggyBank, ArrowRight, Sparkles } from 'lucide-react';

export default function GoalRecommendations({ recommendations, onSelectGoal }) {
  const navigate = useNavigate();

  const iconMap = {
    TrendingUp,
    Home,
    PiggyBank
  };

  const defaultRecommendations = [
    {
      id: 'rec-1',
      title: "You're 20% behind on Europe Trip",
      description: 'Try saving an extra ₹5,000 per month to stay on track.',
      icon: 'TrendingUp',
      iconBg: 'bg-[#123D32]',
      iconColor: 'text-[#35E9A0]',
      actionColor: 'bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114]'
    },
    {
      id: 'rec-2',
      title: 'Great progress on Home Down Payment!',
      description: "You're 5% ahead of schedule. Keep it up!",
      icon: 'Home',
      iconBg: 'bg-[#18384D]',
      iconColor: 'text-[#45B7F5]',
      actionColor: 'bg-[#45B7F5] hover:bg-[#67C8F8] text-[#0B1114]'
    },
    {
      id: 'rec-3',
      title: 'Consider increasing Emergency Fund',
      description: 'Aim for 8–12 months of expenses for better financial security.',
      icon: 'PiggyBank',
      iconBg: 'bg-[#2A1A40]',
      iconColor: 'text-[#B18AFF]',
      actionColor: 'bg-[#B18AFF] hover:bg-[#C5A6FF] text-[#0B1114]'
    }
  ];

  const items = recommendations && recommendations.length > 0 ? recommendations : defaultRecommendations;

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4.5 sm:p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#24363B]/40">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-bold text-[#F1F5F4] tracking-tight">
            AI Recommendations
          </h3>
        </div>
        <button
          onClick={() => navigate('/ai-insights')}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Cards List */}
      <div className="space-y-2.5">
        {items.map((item) => {
          const Icon = iconMap[item.icon] || Sparkles;
          return (
            <div
              key={item.id}
              onClick={() => {
                if (item.goalId && onSelectGoal) {
                  onSelectGoal(item.goalId);
                } else {
                  navigate('/ai-insights');
                }
              }}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#18272C]/50 hover:bg-[#18272C] transition-all border border-transparent hover:border-[#24363B] cursor-pointer group"
            >
              {/* Left Icon */}
              <div
                className={`w-8 h-8 rounded-xl ${
                  item.iconBg || 'bg-[#18272C]'
                } flex items-center justify-center shrink-0 shadow-xs`}
              >
                <Icon className={`w-4 h-4 ${item.iconColor || 'text-[#35E9A0]'}`} />
              </div>

              {/* Title & Description */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#F1F5F4] group-hover:text-[#35E9A0] transition-colors truncate leading-tight">
                  {item.title}
                </p>
                <p className="text-[11px] text-[#A5B4B8] mt-0.5 truncate leading-tight">
                  {item.description}
                </p>
              </div>

              {/* Circular Action Button */}
              <div
                className={`w-7 h-7 rounded-full ${
                  item.actionColor || 'bg-[#35E9A0] text-[#0B1114]'
                } flex items-center justify-center transition-all shrink-0 group-hover:scale-105 shadow-xs`}
              >
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
