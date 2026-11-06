import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Utensils,
  Briefcase,
  ShoppingBag,
  Zap,
  Dumbbell,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Plus
} from 'lucide-react';
import { formatCurrency, formatDate, compareLatestFirst } from '../../utils/formatters';

// Helper to determine styling for live backend transactions
const getCategoryStyle = (category, type) => {
  const cat = (category || '').toLowerCase();
  if (type === 'income' || cat.includes('income') || cat.includes('salary')) {
    return {
      icon: Briefcase,
      iconBg: 'bg-[#123D32]',
      iconColor: 'text-[#35E9A0]',
      badgeBg: 'bg-[#123D32]/50',
      badgeBorder: 'border-[#35E9A0]/30',
      badgeText: 'text-[#35E9A0]'
    };
  }

  if (cat.includes('food') || cat.includes('dining')) {
    return {
      icon: Utensils,
      iconBg: 'bg-[#3D1A22]',
      iconColor: 'text-[#FF667A]',
      badgeBg: 'bg-[#3D1A22]/40',
      badgeBorder: 'border-[#FF667A]/30',
      badgeText: 'text-[#FF667A]'
    };
  }

  if (cat.includes('shopping')) {
    return {
      icon: ShoppingBag,
      iconBg: 'bg-[#382818]',
      iconColor: 'text-[#FF8A48]',
      badgeBg: 'bg-[#382818]/40',
      badgeBorder: 'border-[#FF8A48]/30',
      badgeText: 'text-[#FF8A48]'
    };
  }

  if (cat.includes('bill') || cat.includes('utility')) {
    return {
      icon: Zap,
      iconBg: 'bg-[#163038]',
      iconColor: 'text-[#20D6C7]',
      badgeBg: 'bg-[#163038]/40',
      badgeBorder: 'border-[#20D6C7]/30',
      badgeText: 'text-[#20D6C7]'
    };
  }

  return {
    icon: DollarSign,
    iconBg: 'bg-[#18272C]',
    iconColor: 'text-[#A5B4B8]',
    badgeBg: 'bg-[#18272C]',
    badgeBorder: 'border-[#24363B]',
    badgeText: 'text-[#A5B4B8]'
  };
};

export default function RecentTransactions({
  transactions = [],
  onViewAll,
  onAddTransaction,
  searchQuery = ''
}) {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate('/transactions');
    }
  };

  let displayList = [];

  if (Array.isArray(transactions) && transactions.length > 0) {
    const sorted = [...transactions].sort(compareLatestFirst);
    displayList = sorted.slice(0, 5).map((tx, idx) => {
      const isIncome = tx.type === 'income' || Boolean(tx.source);
      const style = getCategoryStyle(tx.category || tx.source || (isIncome ? 'Income' : 'General'), isIncome ? 'income' : 'expense');
      return {
        id: tx._id || `live-tx-${idx}`,
        date: tx.date || new Date().toISOString(),
        name: tx.source || tx.description || (isIncome ? 'Income' : 'Expense'),
        description: tx.description || tx.source || (isIncome ? 'Income' : 'Expense'),
        category: tx.category || tx.source || (isIncome ? 'Income' : 'General'),
        source: tx.source || (isIncome ? 'Salary' : undefined),
        type: isIncome ? 'income' : 'expense',
        amount: tx.amount,
        ...style
      };
    });
  }

  // Filter with search query if any
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayList = displayList.filter(
      (tx) =>
        (tx.description || '').toLowerCase().includes(q) ||
        (tx.category || '').toLowerCase().includes(q) ||
        (tx.date || '').toLowerCase().includes(q)
    );
  }

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight">
          Recent Transactions
        </h3>
        <button
          onClick={handleViewAll}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] hover:underline transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Table Container */}
      {displayList.length === 0 ? (
        <div className="py-10 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-xl bg-[#18272C] border border-[#24363B] flex items-center justify-center text-[#71848A] mb-2.5">
            <ArrowDownLeft className="w-5 h-5 text-[#35E9A0]" />
          </div>
          <p className="text-sm font-semibold text-[#F1F5F4]">No transactions recorded</p>
          <p className="text-xs text-[#71848A] mt-1 mb-3">Add an expense or income to see it here.</p>
          {onAddTransaction && (
            <button
              onClick={onAddTransaction}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#35E9A0] text-[#0B1114] text-xs font-semibold hover:bg-[#4FFFB0] transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Transaction</span>
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full min-w-[440px] text-left text-xs">
            <thead>
              <tr className="text-[#71848A] border-b border-[#24363B]/60 pb-2">
                <th className="font-medium pb-2.5 pl-1 w-28">Date</th>
                <th className="font-medium pb-2.5">Description</th>
                <th className="font-medium pb-2.5">Category</th>
                <th className="font-medium pb-2.5 text-right pr-1">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24363B]/40">
              {displayList.map((tx) => {
                const IconComponent = tx.icon;
                const isIncome = tx.type === 'income';

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-[#18272C]/50 transition duration-150 group"
                  >
                    {/* Date */}
                    <td className="py-2.5 pl-1 text-[#A5B4B8] whitespace-nowrap text-[11px] font-normal">
                      {formatDate(tx.date)}
                    </td>

                    {/* Description */}
                    <td className="py-2.5 pr-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg ${tx.iconBg} ${tx.iconColor} flex items-center justify-center shrink-0 shadow-xs`}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium text-[#F1F5F4] truncate max-w-[150px] sm:max-w-[190px]">
                          {tx.description}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-2.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium border ${tx.badgeBg} ${tx.badgeBorder} ${tx.badgeText} whitespace-nowrap`}
                      >
                        {tx.category}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-2.5 pr-1 text-right whitespace-nowrap">
                      <span
                        className={`font-bold tracking-tight text-xs flex items-center justify-end gap-1 ${
                          isIncome ? 'text-[#35E9A0]' : 'text-[#FF667A]'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownLeft className="w-3 h-3 text-[#35E9A0]" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3 text-[#FF667A]" />
                        )}
                        <span>
                          {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                        </span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
