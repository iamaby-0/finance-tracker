import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Landmark,
  Laptop,
  TrendingUp,
  MoreHorizontal,
  Pencil,
  Trash2,
  DollarSign,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import api from '../../services/api';

const YoutubeIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const DEFAULT_INCOME_ROWS = [
  {
    _id: 'mock-1',
    date: '2026-10-19',
    source: 'Salary',
    category: 'Salary',
    amount: 70000,
    notes: 'Monthly salary',
    icon: Landmark,
    iconBg: 'bg-[#123D32]',
    iconColor: 'text-[#35E9A0]',
    badgeBg: 'bg-[#123D32]/60',
    badgeBorder: 'border-[#35E9A0]/30',
    badgeText: 'text-[#35E9A0]'
  },
  {
    _id: 'mock-2',
    date: '2026-10-12',
    source: 'Freelance',
    category: 'Freelance',
    amount: 8500,
    notes: 'Client project',
    icon: Laptop,
    iconBg: 'bg-[#2B1B3D]',
    iconColor: 'text-[#B18AFF]',
    badgeBg: 'bg-[#2B1B3D]/60',
    badgeBorder: 'border-[#B18AFF]/30',
    badgeText: 'text-[#B18AFF]'
  },
  {
    _id: 'mock-3',
    date: '2026-10-05',
    source: 'Investment',
    category: 'Investment',
    amount: 4200,
    notes: 'Dividends',
    icon: TrendingUp,
    iconBg: 'bg-[#182C3D]',
    iconColor: 'text-[#45B7F5]',
    badgeBg: 'bg-[#182C3D]/60',
    badgeBorder: 'border-[#45B7F5]/30',
    badgeText: 'text-[#45B7F5]'
  },
  {
    _id: 'mock-4',
    date: '2026-09-28',
    source: 'Other',
    category: 'Other',
    amount: 2300,
    notes: 'Cashback',
    icon: MoreHorizontal,
    iconBg: 'bg-[#382818]',
    iconColor: 'text-[#F6C85F]',
    badgeBg: 'bg-[#382818]/60',
    badgeBorder: 'border-[#F6C85F]/30',
    badgeText: 'text-[#F6C85F]'
  },
  {
    _id: 'mock-5',
    date: '2026-09-15',
    source: 'YouTube',
    category: 'Side Income',
    amount: 6000,
    notes: 'Ad revenue',
    icon: YoutubeIcon,
    iconBg: 'bg-[#3D1A22]',
    iconColor: 'text-[#FF667A]',
    badgeBg: 'bg-[#3D1A22]/60',
    badgeBorder: 'border-[#FF667A]/30',
    badgeText: 'text-[#FF667A]'
  }
];

const getSourceStyle = (source = '', category = '') => {
  const s = (source || '').toLowerCase();
  const c = (category || '').toLowerCase();

  if (s.includes('salary') || c.includes('salary')) {
    return {
      icon: Landmark,
      iconBg: 'bg-[#123D32]',
      iconColor: 'text-[#35E9A0]',
      badgeBg: 'bg-[#123D32]/60',
      badgeBorder: 'border-[#35E9A0]/30',
      badgeText: 'text-[#35E9A0]'
    };
  }
  if (s.includes('freelance') || c.includes('freelance')) {
    return {
      icon: Laptop,
      iconBg: 'bg-[#2B1B3D]',
      iconColor: 'text-[#B18AFF]',
      badgeBg: 'bg-[#2B1B3D]/60',
      badgeBorder: 'border-[#B18AFF]/30',
      badgeText: 'text-[#B18AFF]'
    };
  }
  if (s.includes('invest') || s.includes('dividend') || c.includes('invest')) {
    return {
      icon: TrendingUp,
      iconBg: 'bg-[#182C3D]',
      iconColor: 'text-[#45B7F5]',
      badgeBg: 'bg-[#182C3D]/60',
      badgeBorder: 'border-[#45B7F5]/30',
      badgeText: 'text-[#45B7F5]'
    };
  }
  if (s.includes('youtube') || s.includes('side') || c.includes('side') || s.includes('business')) {
    return {
      icon: YoutubeIcon,
      iconBg: 'bg-[#3D1A22]',
      iconColor: 'text-[#FF667A]',
      badgeBg: 'bg-[#3D1A22]/60',
      badgeBorder: 'border-[#FF667A]/30',
      badgeText: 'text-[#FF667A]'
    };
  }
  return {
    icon: MoreHorizontal,
    iconBg: 'bg-[#382818]',
    iconColor: 'text-[#F6C85F]',
    badgeBg: 'bg-[#382818]/60',
    badgeBorder: 'border-[#F6C85F]/30',
    badgeText: 'text-[#F6C85F]'
  };
};

export default function RecentIncomeTable({
  incomes = null,
  onEdit,
  onRefresh,
  searchQuery = '',
  onViewAll
}) {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Map real backend income records or use default mockup rows
  let displayList = [];

  if (incomes && incomes.length > 0) {
    displayList = incomes.map((item) => {
      const style = getSourceStyle(item.source, item.category);
      return {
        _id: item._id,
        date: item.date,
        name: item.source || item.description || 'Income',
        source: item.source || 'Income',
        category: item.source || item.category || 'Income',
        description: item.description || item.source || 'Income',
        amount: item.amount,
        notes: item.notes || item.description || '-',
        isReal: true,
        ...style
      };
    });
  } else {
    displayList = DEFAULT_INCOME_ROWS;
  }

  // Filter if search query exists
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayList = displayList.filter(
      (item) =>
        (item.source && item.source.toLowerCase().includes(q)) ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        formatDate(item.date).toLowerCase().includes(q)
    );
  }

  const handleDelete = async (id, isReal) => {
    if (!isReal) {
      alert('This is a preview demonstration record.');
      setDeleteId(null);
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete(`/income/${id}`);
      setDeleteId(null);
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Error deleting income:', err);
      alert(err.response?.data?.error || 'Failed to delete income record');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight">
          Recent Income
        </h3>
        <button
          onClick={() => {
            if (onViewAll) {
              onViewAll();
            } else {
              navigate('/transactions?type=Income');
            }
          }}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] hover:underline transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full min-w-[480px] text-left text-xs">
          <thead>
            <tr className="text-[#71848A] border-b border-[#24363B]/60 pb-2">
              <th className="font-medium pb-2.5 pl-1 w-24 sm:w-28">Date</th>
              <th className="font-medium pb-2.5">Source</th>
              <th className="font-medium pb-2.5">Category</th>
              <th className="font-medium pb-2.5 text-right">Amount</th>
              <th className="font-medium pb-2.5 pl-4 hidden md:table-cell">Notes</th>
              <th className="font-medium pb-2.5 text-right pr-1">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#24363B]/40">
            {displayList.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-[#71848A]">
                  No income entries found.
                </td>
              </tr>
            ) : (
              displayList.slice(0, 5).map((row) => {
                const IconComponent = row.icon || Landmark;

                return (
                  <tr
                    key={row._id}
                    className="hover:bg-[#18272C]/50 transition duration-150 group"
                  >
                    {/* Date */}
                    <td className="py-2.5 pl-1 text-[#A5B4B8] whitespace-nowrap text-[11px]">
                      {formatDate(row.date)}
                    </td>

                    {/* Source with Icon */}
                    <td className="py-2.5 pr-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full ${row.iconBg} ${row.iconColor} flex items-center justify-center shrink-0 border border-white/5 shadow-xs`}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium text-[#F1F5F4] text-[12px] truncate max-w-[110px]">
                          {row.source}
                        </span>
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td className="py-2.5 pr-2 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium border ${row.badgeBg} ${row.badgeBorder} ${row.badgeText}`}
                      >
                        {row.category}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-2.5 text-right whitespace-nowrap font-semibold text-[12px] text-[#35E9A0]">
                      +{formatCurrency(row.amount)}
                    </td>

                    {/* Notes */}
                    <td className="py-2.5 pl-4 text-[#71848A] text-[11px] truncate max-w-[140px] hidden md:table-cell">
                      {row.notes}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 pr-1 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit && onEdit(row)}
                          className="p-1 rounded-md text-[#71848A] hover:text-[#35E9A0] hover:bg-[#18272C] transition cursor-pointer"
                          title="Edit Income"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(row._id)}
                          className="p-1 rounded-md text-[#71848A] hover:text-[#FF667A] hover:bg-[#3D1A22]/40 transition cursor-pointer"
                          title="Delete Income"
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

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#121E22] border border-[#24363B] rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-3 text-[#FF667A] mb-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="text-sm font-bold text-[#F1F5F4]">Confirm Deletion</h4>
            </div>
            <p className="text-xs text-[#A5B4B8] leading-relaxed mb-4">
              Are you sure you want to delete this income entry? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-3.5 py-1.5 rounded-lg bg-[#18272C] border border-[#24363B] text-xs text-[#A5B4B8] hover:text-[#F1F5F4] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  const targetRow = displayList.find((r) => r._id === deleteId);
                  handleDelete(deleteId, targetRow?.isReal);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#FF667A] hover:bg-[#ff7d8f] text-[#0B1114] text-xs font-bold transition flex items-center gap-1.5"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
