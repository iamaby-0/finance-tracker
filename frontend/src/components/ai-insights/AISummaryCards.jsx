import React from 'react';
import { Wallet, TrendingDown, PiggyBank, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AISummaryCards({ summary, loading }) {
  const formatINR = (val) => {
    if (typeof val === 'number') {
      return `₹${val.toLocaleString('en-IN')}`;
    }
    if (typeof val === 'string' && !val.startsWith('₹') && !isNaN(Number(val))) {
      return `₹${Number(val).toLocaleString('en-IN')}`;
    }
    return val;
  };

  const cards = [
    {
      id: 'income',
      label: 'Total Income',
      value: summary?.totalIncome?.value !== undefined ? formatINR(summary.totalIncome.value) : '₹85,000',
      change: summary?.totalIncome?.change || '↑ 8.2%',
      isPositive: true,
      icon: Wallet,
      iconBg: 'bg-[#123D32]',
      iconColor: 'text-[#35E9A0]',
      sparklineColor: '#35E9A0',
      type: 'sparkline',
      sparklinePath: 'M0,18 Q15,14 30,12 T55,6 T75,2'
    },
    {
      id: 'expenses',
      label: 'Total Expenses',
      value: summary?.totalExpenses?.value !== undefined ? formatINR(summary.totalExpenses.value) : '₹42,350',
      change: summary?.totalExpenses?.change || '↑ 3.1%',
      isPositive: false, // Expense increase is styled with coral
      icon: TrendingDown,
      iconBg: 'bg-[#3D1A22]',
      iconColor: 'text-[#FF667A]',
      sparklineColor: '#FF667A',
      type: 'sparkline',
      sparklinePath: 'M0,16 Q18,12 35,14 T55,8 T75,3'
    },
    {
      id: 'savings',
      label: 'Savings Rate',
      value: summary?.savingsRate?.value || '34%',
      change: summary?.savingsRate?.change || '↑ 6.4%',
      isPositive: true,
      icon: PiggyBank,
      iconBg: 'bg-[#18384D]',
      iconColor: 'text-[#45B7F5]',
      sparklineColor: '#35E9A0',
      type: 'sparkline',
      sparklinePath: 'M0,19 Q20,15 35,13 T55,7 T75,2'
    },
    {
      id: 'health',
      label: 'Financial Health',
      value: summary?.financialHealth?.value || '78/100',
      change: summary?.financialHealth?.change || '↑ 12 points',
      isPositive: true,
      icon: Target,
      iconBg: 'bg-[#2A1A40]',
      iconColor: 'text-[#B18AFF]',
      type: 'bars'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-[#121E22] border border-[#24363B] animate-pulse p-4" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4.5 hover:border-[#35E9A0]/30 transition-all duration-200 shadow-sm flex flex-col justify-between"
          >
            {/* Top row: Icon & Label */}
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4.5 h-4.5 ${card.iconColor}`} />
              </div>
              <span className="text-xs text-[#A5B4B8] font-medium tracking-tight truncate">
                {card.label}
              </span>
            </div>

            {/* Middle: Amount Value */}
            <div className="mt-2.5">
              <span className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight">
                {card.value}
              </span>
            </div>

            {/* Bottom Row: Percentage / Change & Sparkline */}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span
                  className={`text-xs font-semibold ${
                    card.isPositive ? 'text-[#35E9A0]' : 'text-[#FF667A]'
                  }`}
                >
                  {card.change}
                </span>
              </div>

              {/* Sparkline Graphic or Mini Bars */}
              {card.type === 'sparkline' ? (
                <div className="w-16 h-5">
                  <svg viewBox="0 0 75 22" className="w-full h-full overflow-visible">
                    <path
                      d={card.sparklinePath}
                      fill="none"
                      stroke={card.sparklineColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              ) : (
                /* Mini 4-Bar Level Indicator for Financial Health */
                <div className="flex items-end gap-1 h-5">
                  <span className="w-1.5 h-2 bg-[#35E9A0] rounded-xs" />
                  <span className="w-1.5 h-3.5 bg-[#35E9A0] rounded-xs" />
                  <span className="w-1.5 h-4.5 bg-[#35E9A0] rounded-xs" />
                  <span className="w-1.5 h-5 bg-[#35E9A0] rounded-xs" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
