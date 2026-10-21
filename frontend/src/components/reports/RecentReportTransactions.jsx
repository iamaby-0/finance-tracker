import React from 'react';
import {
  Utensils,
  ShoppingBag,
  Car,
  FileText,
  Film,
  CreditCard,
  Smartphone,
  Banknote
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
    paymentMethod: 'UPI'
  },
  {
    id: 2,
    date: '2026-10-19',
    description: 'Amazon Purchase',
    category: 'Shopping',
    categoryKey: 'Shopping',
    amount: 2199,
    paymentMethod: 'Credit Card'
  },
  {
    id: 3,
    date: '2026-10-18',
    description: 'Diesel',
    category: 'Transport',
    categoryKey: 'Transport',
    amount: 1200,
    paymentMethod: 'Debit Card'
  },
  {
    id: 4,
    date: '2026-10-17',
    description: 'Electricity Bill',
    category: 'Bills & Utilities',
    categoryKey: 'Bills',
    amount: 1230,
    paymentMethod: 'UPI'
  },
  {
    id: 5,
    date: '2026-10-16',
    description: 'Movie Tickets',
    category: 'Entertainment',
    categoryKey: 'Entertainment',
    amount: 650,
    paymentMethod: 'Credit Card'
  }
];

export default function RecentReportTransactions({ transactions = null }) {
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

  const getPaymentMethodBadge = (method) => {
    const m = (method || 'UPI').toLowerCase();
    if (m.includes('card')) {
      return {
        icon: CreditCard,
        color: 'text-[#B18AFF]'
      };
    }
    if (m.includes('cash')) {
      return {
        icon: Banknote,
        color: 'text-[#F6C85F]'
      };
    }
    return {
      icon: Smartphone,
      color: 'text-[#35E9A0]'
    };
  };

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 flex flex-col justify-between h-full shadow-sm">
      {/* Header Row */}
      <div className="mb-3">
        <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
          Recent Transactions (Report View)
        </h3>
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
              <th className="py-2.5 px-3">Payment Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#24363B]/40 text-xs">
            {items.slice(0, 5).map((tx) => {
              const catBadge = getCategoryBadge(tx.category || tx.categoryKey);
              const CatIcon = catBadge.icon;
              const payBadge = getPaymentMethodBadge(tx.paymentMethod);
              const PayIcon = payBadge.icon;

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
                  <td className="py-2.5 px-3 font-semibold text-[#F1F5F4] truncate max-w-[160px]">
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

                  {/* Amount (Negative in Coral-Red) */}
                  <td className="py-2.5 px-3 text-right font-bold text-[#FF667A] whitespace-nowrap">
                    -{formatCurrency(tx.amount)}
                  </td>

                  {/* Payment Method */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5 text-xs text-[#F1F5F4]">
                      <PayIcon className={`w-3.5 h-3.5 ${payBadge.color}`} />
                      <span>{tx.paymentMethod || 'UPI'}</span>
                    </div>
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
