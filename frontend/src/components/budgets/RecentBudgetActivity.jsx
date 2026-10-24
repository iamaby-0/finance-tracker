import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Receipt,
  Heart,
  Gamepad2,
  MoreHorizontal
} from 'lucide-react';
import { formatCurrency, formatDate, compareLatestFirst } from '../../utils/formatters';
import { getCategoryConfig } from './BudgetCategoryList';

const DEFAULT_ACTIVITY_ROWS = [
  {
    _id: 'act-1',
    date: '2026-10-20',
    category: 'Food & Dining',
    action: 'Spent',
    amount: 480,
    status: 'On Track',
    icon: UtensilsCrossed,
    iconBg: 'bg-[#3D1A22]',
    iconColor: 'text-[#FF667A]'
  },
  {
    _id: 'act-2',
    date: '2026-10-19',
    category: 'Shopping',
    action: 'Spent',
    amount: 1299,
    status: 'Near Limit',
    icon: ShoppingBag,
    iconBg: 'bg-[#2B1B3D]',
    iconColor: 'text-[#B18AFF]'
  },
  {
    _id: 'act-3',
    date: '2026-10-18',
    category: 'Transport',
    action: 'Spent',
    amount: 350,
    status: 'On Track',
    icon: Car,
    iconBg: 'bg-[#142C2F]',
    iconColor: 'text-[#20D6C7]'
  },
  {
    _id: 'act-4',
    date: '2026-10-17',
    category: 'Bills & Utilities',
    action: 'Spent',
    amount: 1230,
    status: 'Near Limit',
    icon: Receipt,
    iconBg: 'bg-[#382818]',
    iconColor: 'text-[#F6C85F]'
  },
  {
    _id: 'act-5',
    date: '2026-10-16',
    category: 'Health & Fitness',
    action: 'Spent',
    amount: 500,
    status: 'On Track',
    icon: Heart,
    iconBg: 'bg-[#3D1B24]',
    iconColor: 'text-[#FF85A2]'
  }
];

export default function RecentBudgetActivity({
  expenses = null,
  categoryStatusMap = {},
  onViewAll
}) {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate('/transactions?type=Expenses');
    }
  };

  let displayRows = [];

  if (expenses && expenses.length > 0) {
    const sorted = [...expenses].sort(compareLatestFirst);
    displayRows = sorted.slice(0, 5).map((exp) => {
      const cfg = getCategoryConfig(exp.category);
      const catStatus = categoryStatusMap[exp.category] || 'On Track';

      return {
        _id: exp._id,
        date: exp.date,
        category: cfg.displayName,
        action: 'Spent',
        amount: exp.amount,
        status: catStatus,
        icon: cfg.icon,
        iconBg: cfg.iconBg,
        iconColor: cfg.iconColor
      };
    });
  } else {
    displayRows = DEFAULT_ACTIVITY_ROWS;
  }

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight">
          Recent Budget Activity
        </h3>
        <button
          onClick={handleViewAll}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] hover:underline transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-none flex-1">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[#71848A] border-b border-[#24363B]/60 pb-2">
              <th className="font-medium pb-2.5 pl-1 w-24 sm:w-28">Date</th>
              <th className="font-medium pb-2.5">Category</th>
              <th className="font-medium pb-2.5">Action</th>
              <th className="font-medium pb-2.5 text-right">Amount</th>
              <th className="font-medium pb-2.5 text-right pr-1">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#24363B]/40">
            {displayRows.map((row) => {
              const Icon = row.icon || MoreHorizontal;

              let badgeStyle = 'border-[#35E9A0]/30 text-[#35E9A0] bg-[#123D32]/40';
              let dotColor = 'bg-[#35E9A0]';

              if (row.status === 'Near Limit') {
                badgeStyle = 'border-[#F6C85F]/30 text-[#F6C85F] bg-[#382818]/40';
                dotColor = 'bg-[#F6C85F]';
              } else if (row.status === 'Over Budget') {
                badgeStyle = 'border-[#FF667A]/30 text-[#FF667A] bg-[#3D1A22]/40';
                dotColor = 'bg-[#FF667A]';
              }

              return (
                <tr
                  key={row._id}
                  className="hover:bg-[#18272C]/50 transition duration-150 group"
                >
                  {/* Date */}
                  <td className="py-2.5 pl-1 text-[#A5B4B8] whitespace-nowrap text-[11px]">
                    {formatDate(row.date)}
                  </td>

                  {/* Category with Icon */}
                  <td className="py-2.5 pr-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-md ${row.iconBg} ${row.iconColor} flex items-center justify-center shrink-0 border border-white/5 shadow-xs`}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                      <span className="font-medium text-[#F1F5F4] text-[12px] truncate max-w-[130px]">
                        {row.category}
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-2.5 text-[#A5B4B8] text-[11px] whitespace-nowrap">
                    {row.action}
                  </td>

                  {/* Amount */}
                  <td className="py-2.5 text-right whitespace-nowrap font-semibold text-[12px] text-[#F1F5F4]">
                    {formatCurrency(row.amount)}
                  </td>

                  {/* Status Badge with Dot */}
                  <td className="py-2.5 pr-1 text-right whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${badgeStyle}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                      {row.status}
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
