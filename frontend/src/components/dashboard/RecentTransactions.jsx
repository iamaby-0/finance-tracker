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
  DollarSign
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const DEFAULT_TRANSACTIONS = [
  {
    id: 'tx-1',
    date: '2026-10-20',
    description: 'Zomato',
    category: 'Food & Dining',
    type: 'expense',
    amount: 480,
    icon: Utensils,
    iconBg: 'bg-[#3D1A22]',
    iconColor: 'text-[#FF667A]',
    badgeBg: 'bg-[#3D1A22]/40',
    badgeBorder: 'border-[#FF667A]/30',
    badgeText: 'text-[#FF667A]'
  },
  {
    id: 'tx-2',
    date: '2026-10-19',
    description: 'Salary',
    category: 'Income',
    type: 'income',
    amount: 70000,
    icon: Briefcase,
    iconBg: 'bg-[#123D32]',
    iconColor: 'text-[#35E9A0]',
    badgeBg: 'bg-[#123D32]/50',
    badgeBorder: 'border-[#35E9A0]/30',
    badgeText: 'text-[#35E9A0]'
  },
  {
    id: 'tx-3',
    date: '2026-10-18',
    description: 'Amazon',
    category: 'Shopping',
    type: 'expense',
    amount: 2199,
    icon: ShoppingBag,
    iconBg: 'bg-[#382818]',
    iconColor: 'text-[#FF8A48]',
    badgeBg: 'bg-[#382818]/40',
    badgeBorder: 'border-[#FF8A48]/30',
    badgeText: 'text-[#FF8A48]'
  },
  {
    id: 'tx-4',
    date: '2026-10-17',
    description: 'Electricity Bill',
    category: 'Bills & Utilities',
    type: 'expense',
    amount: 1230,
    icon: Zap,
    iconBg: 'bg-[#163038]',
    iconColor: 'text-[#20D6C7]',
    badgeBg: 'bg-[#163038]/40',
    badgeBorder: 'border-[#20D6C7]/30',
    badgeText: 'text-[#20D6C7]'
  },
  {
    id: 'tx-5',
    date: '2026-10-16',
    description: 'Gym Membership',
    category: 'Health & Fitness',
    type: 'expense',
    amount: 1500,
    icon: Dumbbell,
    iconBg: 'bg-[#381B30]',
    iconColor: 'text-[#FF6EA7]',
    badgeBg: 'bg-[#381B30]/40',
    badgeBorder: 'border-[#FF6EA7]/30',
    badgeText: 'text-[#FF6EA7]'
  }
];

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
  if (cat.includes('food') || cat.includes('dining') || cat.includes('restaurant')) {
    return {
      icon: Utensils,
      iconBg: 'bg-[#3D1A22]',
      iconColor: 'text-[#FF667A]',
      badgeBg: 'bg-[#3D1A22]/40',
      badgeBorder: 'border-[#FF667A]/30',
      badgeText: 'text-[#FF667A]'
    };
  }
  if (cat.includes('shop') || cat.includes('amazon') || cat.includes('store')) {
    return {
      icon: ShoppingBag,
      iconBg: 'bg-[#382818]',
      iconColor: 'text-[#FF8A48]',
      badgeBg: 'bg-[#382818]/40',
      badgeBorder: 'border-[#FF8A48]/30',
      badgeText: 'text-[#FF8A48]'
    };
  }
  if (cat.includes('bill') || cat.includes('util') || cat.includes('elect')) {
    return {
      icon: Zap,
      iconBg: 'bg-[#163038]',
      iconColor: 'text-[#20D6C7]',
      badgeBg: 'bg-[#163038]/40',
      badgeBorder: 'border-[#20D6C7]/30',
      badgeText: 'text-[#20D6C7]'
    };
  }
  if (cat.includes('health') || cat.includes('gym') || cat.includes('fit')) {
    return {
      icon: Dumbbell,
      iconBg: 'bg-[#381B30]',
      iconColor: 'text-[#FF6EA7]',
      badgeBg: 'bg-[#381B30]/40',
      badgeBorder: 'border-[#FF6EA7]/30',
      badgeText: 'text-[#FF6EA7]'
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
  transactions = null,
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

  if (transactions && transactions.length > 0) {
    displayList = transactions.slice(0, 5).map((tx, idx) => {
      const isIncome = tx.type === 'income' || Boolean(tx.source);
      const style = getCategoryStyle(tx.category || (isIncome ? 'Income' : 'General'), isIncome ? 'income' : 'expense');
      return {
        id: tx._id || `live-tx-${idx}`,
        date: tx.date || new Date().toISOString(),
        description: tx.description || tx.source || 'Transaction',
        category: tx.category || (isIncome ? 'Income' : 'General'),
        type: isIncome ? 'income' : 'expense',
        amount: tx.amount,
        ...style
      };
    });
  } else {
    displayList = DEFAULT_TRANSACTIONS;
  }

  // Filter with search query if any
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayList = displayList.filter(
      (tx) =>
        tx.description.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        tx.date.toLowerCase().includes(q)
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
            {displayList.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-[#71848A]">
                  No matching transactions found.
                </td>
              </tr>
            ) : (
              displayList.map((tx) => {
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
                          className={`w-7 h-7 rounded-full ${tx.iconBg} ${tx.iconColor} flex items-center justify-center shrink-0 border border-white/5 shadow-xs`}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium text-[#F1F5F4] truncate max-w-[140px] sm:max-w-[180px] text-[12px]">
                          {tx.description}
                        </span>
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td className="py-2.5 pr-2 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${tx.badgeBg} ${tx.badgeBorder} ${tx.badgeText}`}
                      >
                        <IconComponent className="w-3 h-3" />
                        <span>{tx.category}</span>
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-2.5 pr-1 text-right whitespace-nowrap font-semibold text-[12px]">
                      <span className={isIncome ? 'text-[#35E9A0]' : 'text-[#FF667A]'}>
                        {isIncome ? '+ ' : '- '}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
