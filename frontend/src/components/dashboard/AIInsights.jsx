import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  TrendingUp,
  Target,
  ArrowRight,
  Sparkles,
  TrendingDown
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function AIInsights({
  totalIncome = 0,
  totalExpenses = 0,
  transactionCount = 0,
  onViewAll,
  onActionClick
}) {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate('/ai-insights');
    }
  };

  const hasData = transactionCount > 0;
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Dynamically constructed insights from user's live numbers
  const dynamicInsights = [];

  if (hasData) {
    if (totalExpenses > totalIncome && totalIncome > 0) {
      dynamicInsights.push({
        title: 'Expenses exceed income this period',
        description: `You've spent ${formatCurrency(totalExpenses)} compared to an income of ${formatCurrency(totalIncome)}. Review non-essential spending.`,
        icon: TrendingDown,
        iconBg: 'bg-[#3D1A22]',
        iconColor: 'text-[#FF667A]'
      });
    } else if (netSavings > 0) {
      dynamicInsights.push({
        title: `Positive savings rate (${savingsRate}%)`,
        description: `You've saved ${formatCurrency(netSavings)} this period. Keep this momentum to reach your financial targets sooner.`,
        icon: TrendingUp,
        iconBg: 'bg-[#123D32]',
        iconColor: 'text-[#35E9A0]'
      });
    }

    dynamicInsights.push({
      title: 'Active tracking enabled',
      description: `You have logged ${transactionCount} transaction${transactionCount === 1 ? '' : 's'}. Continuous tracking keeps your budget aligned.`,
      icon: Lightbulb,
      iconBg: 'bg-[#382F1B]',
      iconColor: 'text-[#F6C85F]'
    });
  }

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
          onClick={handleViewAll}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] hover:underline transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Cards stack */}
      {!hasData ? (
        <div className="py-7 flex flex-col items-center justify-center text-center my-auto">
          <div className="w-10 h-10 rounded-xl bg-[#2B1B3D] border border-[#B18AFF]/30 flex items-center justify-center text-[#B18AFF] mb-2.5">
            <Sparkles className="w-5 h-5 text-[#B18AFF]" />
          </div>
          <p className="text-xs font-semibold text-[#F1F5F4]">Ready for AI Insights</p>
          <p className="text-[11px] text-[#71848A] mt-0.5 max-w-xs">
            Record your income and expenses to unlock real-time financial advice and automated budget tracking.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {dynamicInsights.slice(0, 2).map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3 sm:p-3.5 rounded-xl bg-[#18272C] border border-[#24363B] hover:border-[#35E9A0]/30 transition group flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 border border-white/5 shadow-xs mt-0.5`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#F1F5F4] leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#A5B4B8] mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
