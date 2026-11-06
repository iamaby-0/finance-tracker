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

  const items = Array.isArray(recommendations) ? recommendations : [];

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
          className="text-[11px] font-semibold text-[#35E9A0] hover:text-[#4FFFB0] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Recommendations List or Empty State */}
      {items.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center my-auto">
          <p className="text-xs text-[#71848A]">Create goals to receive personalized AI recommendations.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.slice(0, 3).map((rec) => {
            const Icon = (typeof rec.icon === 'string' ? iconMap[rec.icon] : rec.icon) || Sparkles;

            return (
              <div
                key={rec.id || rec.title}
                className="p-3 rounded-xl bg-[#18272C] border border-[#24363B] hover:border-[#35E9A0]/40 transition space-y-1.5"
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg ${rec.iconBg || 'bg-[#123D32]'} ${rec.iconColor || 'text-[#35E9A0]'} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-[#F1F5F4] leading-tight">
                      {rec.title}
                    </h4>
                    <p className="text-[11px] text-[#A5B4B8] leading-relaxed mt-0.5">
                      {rec.description}
                    </p>
                  </div>
                </div>

                {rec.goalId && (
                  <div className="flex justify-end pt-0.5">
                    <button
                      onClick={() => onSelectGoal && onSelectGoal(rec.goalId)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${rec.actionColor || 'bg-[#35E9A0] text-[#0B1114]'} transition cursor-pointer`}
                    >
                      View Goal
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
