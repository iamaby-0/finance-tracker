import React from 'react';
import { Wallet, ShoppingBag, PiggyBank, FolderPlus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function CategorySummaryCard({
  totalCategories = 12,
  expenseCategoriesCount = 8,
  incomeCategoriesCount = 4,
  totalExpenses = 42350,
  activeExpenseCategoriesCount = 8,
  mostUsedCategory = 'Food & Dining',
  mostUsedPercentage = 28,
  customCategoriesCount = 3
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* 1. Total Categories */}
      <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4 sm:p-5 flex flex-col justify-between hover:border-[#35E9A0]/40 transition-all duration-200 shadow-sm group">
        <div>
          <div className="w-10 h-10 rounded-xl bg-[#123D32] border border-[#35E9A0]/30 flex items-center justify-center text-[#35E9A0] shadow-xs mb-3">
            <Wallet className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xs sm:text-[13px] font-medium text-[#A5B4B8]">
            Total Categories
          </span>
          <div className="mt-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#F1F5F4] tracking-tight">
              {totalCategories}
            </h3>
          </div>
        </div>
        <div className="mt-2 text-xs text-[#71848A]">
          <span>
            {expenseCategoriesCount} expense • {incomeCategoriesCount} income
          </span>
        </div>
      </div>

      {/* 2. Total Expenses */}
      <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4 sm:p-5 flex flex-col justify-between hover:border-[#B18AFF]/40 transition-all duration-200 shadow-sm group">
        <div>
          <div className="w-10 h-10 rounded-xl bg-[#251E38] border border-[#B18AFF]/30 flex items-center justify-center text-[#B18AFF] shadow-xs mb-3">
            <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xs sm:text-[13px] font-medium text-[#A5B4B8]">
            Total Expenses
          </span>
          <div className="mt-1">
            <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight">
              {formatCurrency(totalExpenses)}
            </h3>
          </div>
        </div>
        <div className="mt-2 text-xs text-[#71848A]">
          <span>Across {activeExpenseCategoriesCount} categories</span>
        </div>
      </div>

      {/* 3. Most Used Category */}
      <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4 sm:p-5 flex flex-col justify-between hover:border-[#45B7F5]/40 transition-all duration-200 shadow-sm group">
        <div>
          <div className="w-10 h-10 rounded-xl bg-[#152538] border border-[#45B7F5]/30 flex items-center justify-center text-[#45B7F5] shadow-xs mb-3">
            <PiggyBank className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xs sm:text-[13px] font-medium text-[#A5B4B8]">
            Most Used Category
          </span>
          <div className="mt-1">
            <h3 className="text-lg sm:text-xl font-bold text-[#F1F5F4] tracking-tight truncate">
              {mostUsedCategory}
            </h3>
          </div>
        </div>
        <div className="mt-2 text-xs text-[#71848A]">
          <span>{mostUsedPercentage}% of total expenses</span>
        </div>
      </div>

      {/* 4. Custom Categories */}
      <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4 sm:p-5 flex flex-col justify-between hover:border-[#F6C85F]/40 transition-all duration-200 shadow-sm group">
        <div>
          <div className="w-10 h-10 rounded-xl bg-[#2A2315] border border-[#F6C85F]/30 flex items-center justify-center text-[#F6C85F] shadow-xs mb-3">
            <FolderPlus className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xs sm:text-[13px] font-medium text-[#A5B4B8]">
            Custom Categories
          </span>
          <div className="mt-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#F1F5F4] tracking-tight">
              {customCategoriesCount}
            </h3>
          </div>
        </div>
        <div className="mt-2 text-xs text-[#71848A]">
          <span>Your custom categories</span>
        </div>
      </div>
    </div>
  );
}
