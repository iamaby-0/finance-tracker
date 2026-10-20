import React from 'react';
import { Wallet, Receipt, BarChart3, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function IncomeSummaryCard({
  totalIncome = 85000,
  totalEntries = 4,
  averageIncome = 21250,
  highestIncome = 70000,
  highestSource = 'Salary',
  highestDate = 'Oct 19, 2026',
  incomeChange = '+8.2%'
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Card 1: Total Income */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 hover:border-[#35E9A0]/30 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-xl bg-[#123D32] border border-[#35E9A0]/20 flex items-center justify-center text-[#35E9A0] shadow-sm mb-3">
            <Wallet className="w-5 h-5 stroke-[2.2]" />
          </div>

          <p className="text-xs font-medium text-[#A5B4B8]">Total Income</p>
          <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight mt-1">
            {formatCurrency(totalIncome)}
          </h3>
        </div>

        {/* Change Indicator & Sparkline */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#24363B]/40">
          <div className="flex items-center text-xs">
            <span className="font-semibold text-[#35E9A0] flex items-center gap-0.5">
              ↗ {incomeChange}
            </span>
            <span className="text-[11px] text-[#71848A] ml-1.5">from last month</span>
          </div>

          {/* Mini Sparkline SVG */}
          <div className="w-16 h-5">
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

      {/* Card 2: Total Entries */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 hover:border-[#B18AFF]/30 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-xl bg-[#2B1B3D] border border-[#B18AFF]/20 flex items-center justify-center text-[#B18AFF] shadow-sm mb-3">
            <Receipt className="w-5 h-5 stroke-[2.2]" />
          </div>

          <p className="text-xs font-medium text-[#A5B4B8]">Total Entries</p>
          <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight mt-1">
            {totalEntries}
          </h3>
        </div>

        <div className="mt-3 pt-2 border-t border-[#24363B]/40">
          <p className="text-[11px] text-[#71848A]">Income sources this month</p>
        </div>
      </div>

      {/* Card 3: Average Income */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 hover:border-[#45B7F5]/30 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-xl bg-[#182C3D] border border-[#45B7F5]/20 flex items-center justify-center text-[#45B7F5] shadow-sm mb-3">
            <BarChart3 className="w-5 h-5 stroke-[2.2]" />
          </div>

          <p className="text-xs font-medium text-[#A5B4B8]">Average Income</p>
          <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight mt-1">
            {formatCurrency(averageIncome)}
          </h3>
        </div>

        <div className="mt-3 pt-2 border-t border-[#24363B]/40">
          <p className="text-[11px] text-[#71848A]">Per transaction</p>
        </div>
      </div>

      {/* Card 4: Highest Income */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 hover:border-[#F6C85F]/30 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-xl bg-[#382818] border border-[#F6C85F]/20 flex items-center justify-center text-[#F6C85F] shadow-sm mb-3">
            <Calendar className="w-5 h-5 stroke-[2.2]" />
          </div>

          <p className="text-xs font-medium text-[#A5B4B8]">Highest Income</p>
          <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight mt-1">
            {formatCurrency(highestIncome)}
          </h3>
        </div>

        <div className="mt-3 pt-2 border-t border-[#24363B]/40">
          <p className="text-[11px] text-[#71848A] truncate">
            {highestSource} · {highestDate}
          </p>
        </div>
      </div>
    </div>
  );
}
