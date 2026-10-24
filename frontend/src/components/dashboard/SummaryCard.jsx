import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Eye,
  EyeOff
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function SummaryCard({
  totalBalance = 124520,
  totalIncome = 85000,
  totalExpenses = 42350,
  budgetSpent = 47650,
  budgetTotal = 70000,
  balanceChange = '+12.5%',
  incomeChange = '+8.2%',
  expenseChange = '+3.1%'
}) {
  const [balanceHidden, setBalanceHidden] = useState(false);

  // Calculate budget percentage
  const budgetPercentage = budgetTotal > 0
    ? Math.min(100, Math.round((budgetSpent / budgetTotal) * 100))
    : 0;

  // SVG circular progress calculation
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (budgetPercentage / 100) * circumference;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Balance */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 hover:border-[#35E9A0]/30 transition-all duration-300 relative group flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#123D32] border border-[#35E9A0]/20 flex items-center justify-center text-[#35E9A0] shadow-sm">
              <Wallet className="w-5 h-5 stroke-[2.2]" />
            </div>
            <button
              onClick={() => setBalanceHidden(!balanceHidden)}
              className="p-1 rounded-lg text-[#71848A] hover:text-[#A5B4B8] hover:bg-[#18272C] transition cursor-pointer"
              aria-label={balanceHidden ? 'Show balance' : 'Hide balance'}
              title={balanceHidden ? 'Show balance' : 'Hide balance'}
            >
              {balanceHidden ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <p className="text-xs font-medium text-[#A5B4B8]">Total Balance</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight truncate">
              {balanceHidden ? '••••••••' : formatCurrency(totalBalance)}
            </h3>
          </div>
        </div>

        {/* Change Indicator & Trend line */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#24363B]/40">
          <div className="flex items-center text-xs">
            <span className="font-semibold text-[#35E9A0] flex items-center gap-0.5">
              ↗ {balanceChange}
            </span>
            <span className="text-[11px] text-[#71848A] ml-1.5 hidden sm:inline">from last month</span>
          </div>

          {/* Mini Sparkline SVG */}
          <div className="w-16 h-5 shrink-0">
            <svg viewBox="0 0 64 20" className="w-full h-full overflow-visible">
              <path
                d="M 2 16 Q 16 14 28 8 T 48 10 T 62 3"
                fill="none"
                stroke="#35E9A0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="62" cy="3" r="2.5" fill="#4FFFB0" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card 2: Total Income */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 hover:border-[#35E9A0]/30 transition-all duration-300 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#123D32] border border-[#35E9A0]/20 flex items-center justify-center text-[#35E9A0] shadow-sm">
              <TrendingUp className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>

          <p className="text-xs font-medium text-[#A5B4B8]">Total Income</p>
          <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight mt-1 truncate">
            {formatCurrency(totalIncome)}
          </h3>
        </div>

        {/* Change Indicator & Bar Decoration */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#24363B]/40">
          <div className="flex items-center text-xs">
            <span className="font-semibold text-[#35E9A0] flex items-center gap-0.5">
              ↗ {incomeChange}
            </span>
          </div>

          {/* Mini 4-Bar Mint Chart */}
          <div className="flex items-end gap-1 h-5 shrink-0">
            <span className="w-1.5 h-2 bg-[#35E9A0]/50 rounded-xs"></span>
            <span className="w-1.5 h-3.5 bg-[#35E9A0]/70 rounded-xs"></span>
            <span className="w-1.5 h-4.5 bg-[#35E9A0] rounded-xs"></span>
            <span className="w-1.5 h-5 bg-[#4FFFB0] rounded-xs"></span>
          </div>
        </div>
      </div>

      {/* Card 3: Total Expenses */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 hover:border-[#FF667A]/30 transition-all duration-300 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#3D1A22] border border-[#FF667A]/20 flex items-center justify-center text-[#FF667A] shadow-sm">
              <TrendingDown className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>

          <p className="text-xs font-medium text-[#A5B4B8]">Total Expenses</p>
          <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight mt-1 truncate">
            {formatCurrency(totalExpenses)}
          </h3>
        </div>

        {/* Change Indicator & Bar Decoration */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#24363B]/40">
          <div className="flex items-center text-xs">
            <span className="font-semibold text-[#FF667A] flex items-center gap-0.5">
              ↗ {expenseChange}
            </span>
          </div>

          {/* Mini 4-Bar Coral Chart */}
          <div className="flex items-end gap-1 h-5 shrink-0">
            <span className="w-1.5 h-2.5 bg-[#FF667A]/40 rounded-xs"></span>
            <span className="w-1.5 h-3 bg-[#FF667A]/60 rounded-xs"></span>
            <span className="w-1.5 h-4 bg-[#FF667A]/80 rounded-xs"></span>
            <span className="w-1.5 h-5 bg-[#FF667A] rounded-xs"></span>
          </div>
        </div>
      </div>

      {/* Card 4: Budget Used */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 hover:border-[#35E9A0]/30 transition-all duration-300 flex flex-col justify-between min-w-0">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1 mr-2">
            <div className="w-10 h-10 rounded-xl bg-[#182C3D] border border-[#45B7F5]/20 flex items-center justify-center text-[#45B7F5] shadow-sm mb-3">
              <CreditCard className="w-5 h-5 stroke-[2.2]" />
            </div>
            <p className="text-xs font-medium text-[#A5B4B8]">Budget Used</p>
            <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight mt-1 truncate">
              {budgetPercentage}%
            </h3>
          </div>

          {/* Circular Progress Ring */}
          <div className="relative w-12 h-12 flex items-center justify-center mt-1">
            <svg className="w-12 h-12 -rotate-90 transform" viewBox="0 0 44 44">
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-[#18272C]"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-[#35E9A0] transition-all duration-1000 ease-out"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
          </div>
        </div>

        {/* Supporting text */}
        <div className="mt-3 pt-2 border-t border-[#24363B]/40">
          <p className="text-[11px] text-[#71848A]">
            {formatCurrency(budgetSpent)} of {formatCurrency(budgetTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}
