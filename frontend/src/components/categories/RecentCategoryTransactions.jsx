import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Utensils,
  ShoppingBag,
  Car,
  FileText,
  Film,
  Tag
} from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';

const DEFAULT_TRANSACTIONS = [
  {
    id: 1,
    date: '2026-10-20',
    description: 'Zomato Order',
    category: 'Food & Dining',
    categoryKey: 'Food',
    amount: 480,
    type: 'Expense'
  },
  {
    id: 2,
    date: '2026-10-19',
    description: 'Amazon Purchase',
    category: 'Shopping',
    categoryKey: 'Shopping',
    amount: 2199,
    type: 'Expense'
  },
  {
    id: 3,
    date: '2026-10-18',
    description: 'Diesel',
    category: 'Transport',
    categoryKey: 'Transport',
    amount: 1200,
    type: 'Expense'
  },
  {
    id: 4,
    date: '2026-10-17',
    description: 'Electricity Bill',
    category: 'Bills & Utilities',
    categoryKey: 'Bills',
    amount: 1230,
    type: 'Expense'
  },
  {
    id: 5,
    date: '2026-10-16',
    description: 'Movie Tickets',
    category: 'Entertainment',
    categoryKey: 'Entertainment',
    amount: 650,
    type: 'Expense'
  }
];

export default function RecentCategoryTransactions({ transactions = null }) {
  const navigate = useNavigate();
  const items = transactions && transactions.length > 0 ? transactions : DEFAULT_TRANSACTIONS;

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'Food & Dining':
      case 'Food':
        return {
          icon: Utensils,
          bg: 'bg-[#2A161B]',
          border: 'border-[#FF667A]/30',
          text: 'text-[#FF667A]',
          label: 'Food & Dining'
        };
      case 'Shopping':
        return {
          icon: ShoppingBag,
          bg: 'bg-[#251E38]',
          border: 'border-[#B18AFF]/30',
          text: 'text-[#B18AFF]',
          label: 'Shopping'
        };
      case 'Transport':
        return {
          icon: Car,
          bg: 'bg-[#152538]',
          border: 'border-[#45B7F5]/30',
          text: 'text-[#45B7F5]',
          label: 'Transport'
        };
      case 'Bills & Utilities':
      case 'Bills':
        return {
          icon: FileText,
          bg: 'bg-[#123832]',
          border: 'border-[#20D6C7]/30',
          text: 'text-[#20D6C7]',
          label: 'Bills & Utilities'
        };
      case 'Entertainment':
        return {
          icon: Film,
          bg: 'bg-[#2E1825]',
          border: 'border-[#FF6EA7]/30',
          text: 'text-[#FF6EA7]',
          label: 'Entertainment'
        };
      default:
        return {
          icon: ShoppingBag,
          bg: 'bg-[#18272C]',
          border: 'border-[#24363B]',
          text: 'text-[#A5B4B8]',
          label: cat || 'Other'
        };
    }
  };

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 flex flex-col justify-between h-full shadow-sm">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
          Recent Transactions by Category
        </h3>
        <button
          type="button"
          onClick={() => navigate('/transactions')}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-[#24363B] text-[11px] font-semibold uppercase tracking-wider text-[#71848A]">
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
              <th className="py-2.5 px-3 text-center">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#24363B]/40 text-xs">
            {items.slice(0, 5).map((tx) => {
              const catBadge = getCategoryBadge(tx.category || tx.categoryKey);
              const CatIcon = catBadge.icon;
              const isExpense = (tx.type || 'Expense').toLowerCase() === 'expense';

              return (
                <tr
                  key={tx.id || tx._id || tx.description}
                  className="hover:bg-[#18272C]/40 transition-colors"
                >
                  {/* Date */}
                  <td className="py-2.5 px-3 text-[#A5B4B8] whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>

                  {/* Description */}
                  <td className="py-2.5 px-3 font-semibold text-[#F1F5F4] truncate max-w-[150px]">
                    {tx.description}
                  </td>

                  {/* Category Pill */}
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${catBadge.bg} ${catBadge.border} ${catBadge.text}`}
                    >
                      <CatIcon className="w-3 h-3" />
                      <span>{catBadge.label}</span>
                    </span>
                  </td>

                  {/* Amount (Negative in Coral-Red for Expense) */}
                  <td className="py-2.5 px-3 text-right font-bold text-[#FF667A] whitespace-nowrap">
                    -{formatCurrency(tx.amount)}
                  </td>

                  {/* Type Pill */}
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border ${
                        isExpense
                          ? 'bg-[#2A161B] border-[#FF667A]/30 text-[#FF667A]'
                          : 'bg-[#123D32] border-[#35E9A0]/30 text-[#35E9A0]'
                      }`}
                    >
                      <Tag className="w-2.5 h-2.5" />
                      <span>{isExpense ? 'Expense' : 'Income'}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
