import React from 'react';
import { ArrowDownRight, TrendingUp, ShoppingBag, Wallet, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function ExpenseSummaryCard({
  totalExpenses = 42350,
  totalTransactions = 28,
  averageExpense = 1512,
  highestExpense = 4850,
  highestMerchant = 'Amazon',
  highestDate = 'Oct 18, 2026',
  expenseChange = '+12.5%',
  transactionsChange = '+4'
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Expenses */}
      <div className="relative overflow-hidden rounded-2xl bg-[#121E22] border border-[#24363B] p-5 shadow-lg group hover:border-[#FF667A]/40 transition duration-300">
        {/* Subtle Background Glow */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#FF667A]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header Row: Icon & Mini Trend SVG */}
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#3D1A22] border border-[#FF667A]/30 flex items-center justify-center text-[#FF667A] shadow-xs">
            <ArrowDownRight className="w-5 h-5 stroke-[2.5]" />
          </div>

          {/* Mini Coral SVG Trendline in top-right */}
          <div className="w-20 h-7 opacity-80 group-hover:opacity-100 transition">
            <svg viewBox="0 0 80 28" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="expCardGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF667A" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FF667A" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,22 Q20,24 35,16 T60,18 T80,4 L80,28 L0,28 Z"
                fill="url(#expCardGrad)"
              />
              <path
                d="M0,22 Q20,24 35,16 T60,18 T80,4"
                fill="none"
                stroke="#FF667A"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="80" cy="4" r="2.5" fill="#FF8A48" />
            </svg>
          </div>
        </div>

        {/* Amount & Label */}
        <span className="text-xs font-medium text-[#71848A] block">
          Total Expenses
        </span>
        <div className="text-2xl lg:text-[26px] font-bold text-[#F1F5F4] tracking-tight mt-1">
          {formatCurrency(totalExpenses)}
        </div>

        {/* Change Indicator */}
        <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#FF667A]">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{expenseChange} from last month</span>
        </div>
      </div>

      {/* 2. Total Transactions */}
      <div className="relative overflow-hidden rounded-2xl bg-[#121E22] border border-[#24363B] p-5 shadow-lg group hover:border-[#FF8A48]/40 transition duration-300">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#FF8A48]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#3D221A] border border-[#FF8A48]/30 flex items-center justify-center text-[#FF8A48] shadow-xs">
            <ShoppingBag className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        <span className="text-xs font-medium text-[#71848A] block">
          Total Transactions
        </span>
        <div className="text-2xl lg:text-[26px] font-bold text-[#F1F5F4] tracking-tight mt-1">
          {totalTransactions}
        </div>

        <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#FF8A48]">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{transactionsChange} more than last month</span>
        </div>
      </div>

      {/* 3. Average Expense */}
      <div className="relative overflow-hidden rounded-2xl bg-[#121E22] border border-[#24363B] p-5 shadow-lg group hover:border-[#45B7F5]/40 transition duration-300">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#45B7F5]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#142938] border border-[#45B7F5]/30 flex items-center justify-center text-[#45B7F5] shadow-xs">
            <Wallet className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        <span className="text-xs font-medium text-[#71848A] block">
          Average Expense
        </span>
        <div className="text-2xl lg:text-[26px] font-bold text-[#F1F5F4] tracking-tight mt-1">
          {formatCurrency(averageExpense)}
        </div>

        <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-[#71848A]">
          <span>Per transaction</span>
        </div>
      </div>

      {/* 4. Highest Expense */}
      <div className="relative overflow-hidden rounded-2xl bg-[#121E22] border border-[#24363B] p-5 shadow-lg group hover:border-[#F6C85F]/40 transition duration-300">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#F6C85F]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#362E16] border border-[#F6C85F]/30 flex items-center justify-center text-[#F6C85F] shadow-xs">
            <Clock className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        <span className="text-xs font-medium text-[#71848A] block">
          Highest Expense
        </span>
        <div className="text-2xl lg:text-[26px] font-bold text-[#F1F5F4] tracking-tight mt-1">
          {formatCurrency(highestExpense)}
        </div>

        <div className="flex items-center gap-1 mt-2 text-xs font-medium text-[#71848A] truncate">
          <span className="text-[#A5B4B8] font-semibold">{highestMerchant}</span>
          <span>·</span>
          <span>{highestDate}</span>
        </div>
      </div>
    </div>
  );
}
