import React from 'react';
import { TrendingUp, ArrowDown, PiggyBank, ArrowLeftRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function ReportSummaryCard({
  totalIncome = 85000,
  totalExpenses = 42350,
  totalSavings = 28650,
  netBalance = 124520,
  incomeComparison = '+8.2%',
  expenseComparison = '+12.5%',
  savingsComparison = '+15.4%',
  balanceComparison = '+5.8%'
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* 1. Total Income */}
      <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4 sm:p-5 flex flex-col justify-between hover:border-[#35E9A0]/40 transition-all duration-200 shadow-sm group">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#123D32] border border-[#35E9A0]/30 flex items-center justify-center text-[#35E9A0] shadow-xs">
                <TrendingUp className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs sm:text-[13px] font-medium text-[#A5B4B8]">
                Total Income
              </span>
            </div>

            {/* Sparkline in Mint */}
            <div className="w-16 h-8 opacity-90 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 64 28" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="repIncGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#35E9A0" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#35E9A0" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,22 Q18,20 30,14 T48,8 T64,2 L64,28 L0,28 Z"
                  fill="url(#repIncGrad)"
                />
                <path
                  d="M0,22 Q18,20 30,14 T48,8 T64,2"
                  fill="none"
                  stroke="#35E9A0"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight">
              {formatCurrency(totalIncome)}
            </h3>
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#71848A]">
          <span className="text-[#35E9A0] font-semibold flex items-center gap-0.5">
            ↗ {incomeComparison}
          </span>
          <span>vs last month</span>
        </div>
      </div>

      {/* 2. Total Expenses */}
      <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4 sm:p-5 flex flex-col justify-between hover:border-[#FF667A]/40 transition-all duration-200 shadow-sm group">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2A161B] border border-[#FF667A]/30 flex items-center justify-center text-[#FF667A] shadow-xs">
                <ArrowDown className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs sm:text-[13px] font-medium text-[#A5B4B8]">
                Total Expenses
              </span>
            </div>

            {/* Sparkline in Coral Red */}
            <div className="w-16 h-8 opacity-90 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 64 28" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="repExpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF667A" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#FF667A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,24 Q18,18 32,22 T50,12 T64,6 L64,28 L0,28 Z"
                  fill="url(#repExpGrad)"
                />
                <path
                  d="M0,24 Q18,18 32,22 T50,12 T64,6"
                  fill="none"
                  stroke="#FF667A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight">
              {formatCurrency(totalExpenses)}
            </h3>
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#71848A]">
          <span className="text-[#FF667A] font-semibold flex items-center gap-0.5">
            ↗ {expenseComparison}
          </span>
          <span>vs last month</span>
        </div>
      </div>

      {/* 3. Total Savings */}
      <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4 sm:p-5 flex flex-col justify-between hover:border-[#35E9A0]/40 transition-all duration-200 shadow-sm group">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#152538] border border-[#45B7F5]/30 flex items-center justify-center text-[#45B7F5] shadow-xs">
                <PiggyBank className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs sm:text-[13px] font-medium text-[#A5B4B8]">
                Total Savings
              </span>
            </div>

            {/* Sparkline in Mint */}
            <div className="w-16 h-8 opacity-90 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 64 28" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="repSavGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#35E9A0" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#35E9A0" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,22 Q16,24 30,16 T48,10 T64,4 L64,28 L0,28 Z"
                  fill="url(#repSavGrad)"
                />
                <path
                  d="M0,22 Q16,24 30,16 T48,10 T64,4"
                  fill="none"
                  stroke="#35E9A0"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight">
              {formatCurrency(totalSavings)}
            </h3>
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#71848A]">
          <span className="text-[#35E9A0] font-semibold flex items-center gap-0.5">
            ↗ {savingsComparison}
          </span>
          <span>vs last month</span>
        </div>
      </div>

      {/* 4. Net Balance */}
      <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4 sm:p-5 flex flex-col justify-between hover:border-[#B18AFF]/40 transition-all duration-200 shadow-sm group">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#241833] border border-[#B18AFF]/30 flex items-center justify-center text-[#B18AFF] shadow-xs">
                <ArrowLeftRight className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs sm:text-[13px] font-medium text-[#A5B4B8]">
                Net Balance
              </span>
            </div>

            {/* Sparkline in Purple */}
            <div className="w-16 h-8 opacity-90 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 64 28" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="repBalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B18AFF" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#B18AFF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,20 Q18,22 32,14 T48,10 T64,4 L64,28 L0,28 Z"
                  fill="url(#repBalGrad)"
                />
                <path
                  d="M0,20 Q18,22 32,14 T48,10 T64,4"
                  fill="none"
                  stroke="#B18AFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight">
              {formatCurrency(netBalance)}
            </h3>
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#71848A]">
          <span className="text-[#35E9A0] font-semibold flex items-center gap-0.5">
            ↗ {balanceComparison}
          </span>
          <span>vs last month</span>
        </div>
      </div>
    </div>
  );
}
