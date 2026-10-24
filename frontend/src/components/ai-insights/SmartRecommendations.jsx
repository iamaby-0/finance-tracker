import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CreditCard, TrendingUp, ChevronRight } from 'lucide-react';

export default function SmartRecommendations({ recommendations }) {
  const navigate = useNavigate();

  const iconMap = {
    ShoppingCart,
    CreditCard,
    TrendingUp
  };

  const defaultRecommendations = [
    {
      id: 'rec-1',
      title: 'Set a monthly shopping limit',
      subtitle: 'Try keeping your shopping expenses under ₹5,000.',
      icon: 'ShoppingCart',
      iconBg: 'bg-[#3D1A22]',
      iconColor: 'text-[#FF667A]',
      route: '/budgets'
    },
    {
      id: 'rec-2',
      title: 'Review subscriptions',
      subtitle: 'You have 5 active subscriptions. Consider cancelling unused ones.',
      icon: 'CreditCard',
      iconBg: 'bg-[#123D32]',
      iconColor: 'text-[#35E9A0]',
      route: '/expenses'
    },
    {
      id: 'rec-3',
      title: 'Increase your investments',
      subtitle: 'Try investing an additional ₹2,000 per month to reach your goals faster.',
      icon: 'TrendingUp',
      iconBg: 'bg-[#382D12]',
      iconColor: 'text-[#F6C85F]',
      route: '/analytics'
    }
  ];

  const displayRecommendations =
    recommendations && recommendations.length > 0
      ? recommendations
      : defaultRecommendations;

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4 sm:p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#24363B]/40">
        <h3 className="text-sm font-bold text-[#F1F5F4] tracking-tight">
          Smart Recommendations
        </h3>
        <button
          onClick={() => navigate('/analytics')}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Recommendations List */}
      <div className="space-y-2.5">
        {displayRecommendations.map((item) => {
          const Icon = iconMap[item.icon] || TrendingUp;
          return (
            <div
              key={item.id}
              onClick={() => navigate(item.route || '/expenses')}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#18272C]/50 hover:bg-[#18272C] transition-all border border-transparent hover:border-[#24363B] cursor-pointer group"
            >
              {/* Left Icon */}
              <div
                className={`w-8 h-8 rounded-xl ${
                  item.iconBg || 'bg-[#18272C]'
                } flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-4 h-4 ${item.iconColor || 'text-[#35E9A0]'}`} />
              </div>

              {/* Title & Subtitle */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#F1F5F4] group-hover:text-[#35E9A0] transition-colors truncate">
                  {item.title}
                </p>
                <p className="text-[11px] text-[#71848A] mt-0.5 truncate">
                  {item.subtitle}
                </p>
              </div>

              {/* Right Arrow */}
              <ChevronRight className="w-4 h-4 text-[#71848A] group-hover:text-[#F1F5F4] group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
