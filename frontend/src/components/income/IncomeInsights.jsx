import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function IncomeInsights({
  insights = null
}) {
  const items = Array.isArray(insights) ? insights : [];

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

      {/* 3 Insight Cards or Empty prompt */}
      {items.length === 0 ? (
        <div className="py-4 text-center text-xs text-[#71848A]">
          Record more income entries to unlock automated insights.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {items.map((item) => {
            const Icon = item.icon || TrendingUp;
            return (
              <div
                key={item.id || item.title}
                className={`p-3.5 rounded-xl bg-[#18272C] border border-[#24363B] ${item.hoverBorder || 'hover:border-[#35E9A0]/30'} transition flex items-start gap-3 group`}
              >
                <div
                  className={`w-9 h-9 rounded-xl ${item.iconBg || 'bg-[#123D32]'} ${item.iconColor || 'text-[#35E9A0]'} flex items-center justify-center shrink-0 border border-white/5 shadow-xs mt-0.5`}
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
      )}
    </div>
  );
}
