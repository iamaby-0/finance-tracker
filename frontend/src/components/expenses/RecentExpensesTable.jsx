import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pencil,
  Trash2,
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Zap,
  Gamepad2,
  HeartPulse,
  Tags,
  Receipt
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

// Merchant icon resolver
function getMerchantIcon(description = '', category = '') {
  const desc = description.toLowerCase().trim();
  const cat = category.toLowerCase().trim();

  if (desc.includes('zomato') || desc.includes('swiggy')) {
    return (
      <div className="w-7 h-7 rounded-lg bg-[#E23744] flex items-center justify-center text-white shrink-0 shadow-xs">
        <UtensilsCrossed className="w-3.5 h-3.5" />
      </div>
    );
  }
  if (desc.includes('amazon')) {
    return (
      <div className="w-7 h-7 rounded-lg bg-[#FF9900] flex items-center justify-center text-white shrink-0 shadow-xs font-bold text-xs">
        a
      </div>
    );
  }
  if (desc.includes('diesel') || desc.includes('petrol') || desc.includes('fuel') || desc.includes('uber') || desc.includes('cab')) {
    return (
      <div className="w-7 h-7 rounded-lg bg-[#0284C7] flex items-center justify-center text-white shrink-0 shadow-xs">
        <Car className="w-3.5 h-3.5" />
      </div>
    );
  }
  if (desc.includes('electricity') || desc.includes('power') || desc.includes('bill') || desc.includes('recharge')) {
    return (
      <div className="w-7 h-7 rounded-lg bg-[#EAB308] flex items-center justify-center text-white shrink-0 shadow-xs">
        <Zap className="w-3.5 h-3.5 fill-white" />
      </div>
    );
  }
  if (desc.includes('movie') || desc.includes('tickets') || desc.includes('cinema') || desc.includes('netflix')) {
    return (
      <div className="w-7 h-7 rounded-lg bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-xs">
        <Gamepad2 className="w-3.5 h-3.5" />
      </div>
    );
  }

  // Fallbacks by category
  if (cat.includes('food')) {
    return (
      <div className="w-7 h-7 rounded-lg bg-[#EA580C] flex items-center justify-center text-white shrink-0">
        <UtensilsCrossed className="w-3.5 h-3.5" />
      </div>
    );
  }
  if (cat.includes('shopping')) {
    return (
      <div className="w-7 h-7 rounded-lg bg-[#7C3AED] flex items-center justify-center text-white shrink-0">
        <ShoppingBag className="w-3.5 h-3.5" />
      </div>
    );
  }
  if (cat.includes('transport')) {
    return (
      <div className="w-7 h-7 rounded-lg bg-[#0284C7] flex items-center justify-center text-white shrink-0">
        <Car className="w-3.5 h-3.5" />
      </div>
    );
  }
  if (cat.includes('bills')) {
    return (
      <div className="w-7 h-7 rounded-lg bg-[#CA8A04] flex items-center justify-center text-white shrink-0">
        <Zap className="w-3.5 h-3.5 fill-white" />
      </div>
    );
  }
  if (cat.includes('health')) {
    return (
      <div className="w-7 h-7 rounded-lg bg-[#E11D48] flex items-center justify-center text-white shrink-0">
        <HeartPulse className="w-3.5 h-3.5" />
      </div>
    );
  }

  return (
    <div className="w-7 h-7 rounded-lg bg-[#18272C] border border-[#24363B] flex items-center justify-center text-[#FF667A] shrink-0">
      <Receipt className="w-3.5 h-3.5" />
    </div>
  );
}

// Category badge styling resolver
function getCategoryBadge(category = '') {
  const cat = category.toLowerCase().trim();

  if (cat.includes('food') || cat.includes('dining')) {
    return {
      label: 'Food & Dining',
      bg: 'bg-[#3D1A22]',
      border: 'border-[#FF667A]/30',
      text: 'text-[#FF8A48]',
      icon: UtensilsCrossed
    };
  }
  if (cat.includes('shopping')) {
    return {
      label: 'Shopping',
      bg: 'bg-[#29173D]',
      border: 'border-[#B18AFF]/30',
      text: 'text-[#B18AFF]',
      icon: ShoppingBag
    };
  }
  if (cat.includes('transport')) {
    return {
      label: 'Transport',
      bg: 'bg-[#122A38]',
      border: 'border-[#20D6C7]/30',
      text: 'text-[#20D6C7]',
      icon: Car
    };
  }
  if (cat.includes('bills') || cat.includes('utilities')) {
    return {
      label: 'Bills & Utilities',
      bg: 'bg-[#332A12]',
      border: 'border-[#F6C85F]/30',
      text: 'text-[#F6C85F]',
      icon: Zap
    };
  }
  if (cat.includes('entertainment')) {
    return {
      label: 'Entertainment',
      bg: 'bg-[#29173D]',
      border: 'border-[#8B5CF6]/30',
      text: 'text-[#8B5CF6]',
      icon: Gamepad2
    };
  }
  if (cat.includes('health')) {
    return {
      label: 'Health & Fitness',
      bg: 'bg-[#3D1A2C]',
      border: 'border-[#FF6EA7]/30',
      text: 'text-[#FF6EA7]',
      icon: HeartPulse
    };
  }

  return {
    label: category || 'Other',
    bg: 'bg-[#18272C]',
    border: 'border-[#24363B]',
    text: 'text-[#A5B4B8]',
    icon: Tags
  };
}

const DEFAULT_RECENT_EXPENSES = [
  {
    _id: 'sample-1',
    date: '2026-10-20T12:00:00.000Z',
    description: 'Zomato',
    category: 'Food',
    amount: 480
  },
  {
    _id: 'sample-2',
    date: '2026-10-19T15:30:00.000Z',
    description: 'Amazon',
    category: 'Shopping',
    amount: 2199
  },
  {
    _id: 'sample-3',
    date: '2026-10-18T18:45:00.000Z',
    description: 'Diesel',
    category: 'Transport',
    amount: 1200
  },
  {
    _id: 'sample-4',
    date: '2026-10-17T10:15:00.000Z',
    description: 'Electricity Bill',
    category: 'Bills',
    amount: 1230
  },
  {
    _id: 'sample-5',
    date: '2026-10-16T21:00:00.000Z',
    description: 'Movie Tickets',
    category: 'Entertainment',
    amount: 650
  }
];

export default function RecentExpensesTable({
  expenses = [],
  loading = false,
  onEdit,
  onDelete
}) {
  const navigate = useNavigate();

  const displayList =
    expenses && expenses.length > 0
      ? expenses.slice(0, 5)
      : DEFAULT_RECENT_EXPENSES;

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 shadow-lg flex flex-col justify-between h-full">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
            Recent Expenses
          </h3>
          <p className="text-xs text-[#71848A] mt-0.5">
            Latest recorded transactions
          </p>
        </div>

        {/* View All Link */}
        <button
          onClick={() => navigate('/transactions')}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] hover:underline transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-[#24363B] text-[11px] font-semibold uppercase tracking-wider text-[#71848A] select-none">
              <th className="pb-3 px-3">Date</th>
              <th className="pb-3 px-3">Description</th>
              <th className="pb-3 px-3">Category</th>
              <th className="pb-3 px-3 text-right">Amount</th>
              <th className="pb-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#24363B]/50">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-3 px-3"><div className="h-3 w-16 bg-[#18272C] rounded" /></td>
                  <td className="py-3 px-3"><div className="h-3 w-28 bg-[#18272C] rounded" /></td>
                  <td className="py-3 px-3"><div className="h-5 w-20 bg-[#18272C] rounded-full" /></td>
                  <td className="py-3 px-3 text-right"><div className="h-3 w-14 bg-[#18272C] rounded ml-auto" /></td>
                  <td className="py-3 px-3 text-right"><div className="h-4 w-10 bg-[#18272C] rounded ml-auto" /></td>
                </tr>
              ))
            ) : (
              displayList.map((item) => {
                const badge = getCategoryBadge(item.category);
                const BadgeIcon = badge.icon;
                const formattedDate = formatDate(item.date) || 'Oct 20, 2026';

                return (
                  <tr
                    key={item._id}
                    className="hover:bg-[#18272C]/50 transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3 px-3 text-xs text-[#A5B4B8] whitespace-nowrap">
                      {formattedDate}
                    </td>

                    {/* Description */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        {getMerchantIcon(item.description, item.category)}
                        <span className="text-xs sm:text-sm font-semibold text-[#F1F5F4] truncate max-w-[130px] sm:max-w-[180px]">
                          {item.description || item.category}
                        </span>
                      </div>
                    </td>

                    {/* Category Pill */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${badge.bg} ${badge.border} ${badge.text}`}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-bold text-[#FF667A]">
                        - {formatCurrency(item.amount)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onEdit && onEdit(item)}
                          className="p-1 rounded-md text-[#71848A] hover:text-[#35E9A0] hover:bg-[#18272C] transition cursor-pointer"
                          aria-label="Edit expense"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete && onDelete(item)}
                          className="p-1 rounded-md text-[#71848A] hover:text-[#FF667A] hover:bg-[#3D1A22]/50 transition cursor-pointer"
                          aria-label="Delete expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
