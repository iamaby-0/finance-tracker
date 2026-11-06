import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function FinancialInsights({ insights = null }) {
  const navigate = useNavigate();
  const items = Array.isArray(insights) ? insights : [];

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 flex flex-col justify-between h-full shadow-sm">
      {/* Header Row: Title & View All */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
          Financial Insights
        </h3>

        <button
          type="button"
          onClick={() => navigate('/ai-insights')}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Insights List or Empty state */}
      {items.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center my-auto">
          <div className="w-10 h-10 rounded-xl bg-[#123D32] text-[#35E9A0] flex items-center justify-center mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-xs text-[#71848A] max-w-xs leading-relaxed">
            Record income and expenses to generate personalized AI financial insights.
          </p>
        </div>
      ) : (
        <div className="space-y-3 my-auto">
          {items.map((item) => {
            const Icon = item.icon || TrendingUp;
            return (
              <div
                key={item.id}
                onClick={() => navigate(item.path || '/ai-insights')}
                className="p-3.5 rounded-xl bg-[#18272C] border border-[#24363B] hover:border-[#35E9A0]/40 transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl ${item.iconBg || 'bg-[#123D32]'} border ${
                      item.iconBorder || 'border-[#35E9A0]/30'
                    } ${item.iconColor || 'text-[#35E9A0]'} flex items-center justify-center flex-shrink-0 shadow-xs`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#F1F5F4] truncate group-hover:text-[#35E9A0] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#71848A] line-clamp-1 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-[#71848A] group-hover:text-[#35E9A0] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
