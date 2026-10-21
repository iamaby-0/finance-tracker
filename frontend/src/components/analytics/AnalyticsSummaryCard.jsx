import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  ArrowDown,
  PiggyBank,
  Eye,
  EyeOff
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function AnalyticsSummaryCard({
  totalBalance = 124520,
  totalIncome = 85000,
  totalExpenses = 42350,
  totalSavings = 28650,
  balanceChange = '+12.5%',
  incomeChange = '+8.2%',
  expenseChange = '+3.1%',
  savingsChange = '+15.4%'
}) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* 1. Total Balance */}
      <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4 sm:p-5 flex flex-col justify-between hover:border-[#35E9A0]/40 transition-all duration-200 shadow-sm group">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#123D32] border border-[#35E9A0]/30 flex items-center justify-center text-[#35E9A0] shadow-xs">
                <Wallet className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs sm:text-[13px] font-medium text-[#A5B4B8]">
                Total Balance
              </span>
            </div>

            {/* Mini Mint SVG Trendline */}
            <div className="w-16 h-8 opacity-90 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 64 28" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#35E9A0" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#35E9A0" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,24 Q16,20 28,14 T48,8 T64,2 L64,28 L0,28 Z"
                  fill="url(#balanceGrad)"
                />
                <path
                  d="M0,24 Q16,20 28,14 T48,8 T64,2"
                  fill="none"
                  stroke="#35E9A0"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2.5">
            <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight">
              {showBalance ? formatCurrency(totalBalance) : '••••••••'}
            </h3>
            <button
              type="button"
              onClick={() => setShowBalance(!showBalance)}
              className="text-[#71848A] hover:text-[#35E9A0] transition-colors p-1 rounded-md"
              aria-label={showBalance ? 'Hide balance' : 'Show balance'}
            >
              {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#71848A]">
          <span className="text-[#35E9A0] font-semibold flex items-center gap-0.5">
            ↗ {balanceChange}
          </span>
          <span>from last month</span>
        </div>
      </div>

      {/* 2. Total Income */}
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

            {/* Mini Mint Vertical Bars Graphic */}
            <div className="flex items-end gap-1 h-7 opacity-90 group-hover:opacity-100 transition-opacity">
              <span className="w-1.5 h-3 bg-[#35E9A0]/60 rounded-xs"></span>
              <span className="w-1.5 h-4.5 bg-[#35E9A0]/80 rounded-xs"></span>
              <span className="w-1.5 h-7 bg-[#35E9A0] rounded-xs"></span>
              <span className="w-1.5 h-5 bg-[#35E9A0] rounded-xs"></span>
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
            ↗ {incomeChange}
          </span>
        </div>
      </div>

      {/* 3. Total Expenses */}
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

            {/* Mini Coral Red Vertical Bars Graphic */}
            <div className="flex items-end gap-1 h-7 opacity-90 group-hover:opacity-100 transition-opacity">
              <span className="w-1.5 h-4 bg-[#FF667A]/60 rounded-xs"></span>
              <span className="w-1.5 h-6.5 bg-[#FF667A] rounded-xs"></span>
              <span className="w-1.5 h-3 bg-[#FF667A]/70 rounded-xs"></span>
              <span className="w-1.5 h-5 bg-[#FF667A] rounded-xs"></span>
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
            ↗ {expenseChange}
          </span>
        </div>
      </div>

      {/* 4. Total Savings */}
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

            {/* Mini Mint SVG Trendline */}
            <div className="w-16 h-8 opacity-90 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 64 28" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#35E9A0" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#35E9A0" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,22 Q18,24 32,16 T50,8 T64,4 L64,28 L0,28 Z"
                  fill="url(#savingsGrad)"
                />
                <path
                  d="M0,22 Q18,24 32,16 T50,8 T64,4"
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
            ↗ {savingsChange}
          </span>
        </div>
      </div>
    </div>
  );
}
