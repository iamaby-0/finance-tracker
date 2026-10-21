import React, { useState, useRef, useEffect } from 'react';
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  UtensilsCrossed,
  Briefcase,
  ShoppingBag,
  Zap,
  Car,
  Landmark,
  Tv,
  Smartphone,
  Globe,
  HelpCircle,
  Shield,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  Building2,
  Plane,
  Tags,
  Receipt,
  ArrowUpDown
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

// Merchant icon resolver
function getMerchantIcon(description = '', category = '') {
  const desc = description.toLowerCase().trim();
  const cat = category.toLowerCase().trim();

  if (desc.includes('zomato')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#E23744] flex items-center justify-center text-white shrink-0 shadow-xs">
        <UtensilsCrossed className="w-4 h-4" />
      </div>
    );
  }
  if (desc.includes('freelance')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#059669] flex items-center justify-center text-white shrink-0 shadow-xs">
        <Briefcase className="w-4 h-4" />
      </div>
    );
  }
  if (desc.includes('amazon')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#FF9900] flex items-center justify-center text-white shrink-0 shadow-xs font-bold text-sm">
        a
      </div>
    );
  }
  if (desc.includes('electricity') || desc.includes('electric') || desc.includes('power')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#EAB308] flex items-center justify-center text-white shrink-0 shadow-xs">
        <Zap className="w-4 h-4 fill-white" />
      </div>
    );
  }
  if (desc.includes('uber') || desc.includes('cab')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center text-white shrink-0 shadow-xs font-extrabold text-xs">
        ✕
      </div>
    );
  }
  if (desc.includes('salary') || desc.includes('payroll')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shrink-0 shadow-xs">
        <Landmark className="w-4 h-4" />
      </div>
    );
  }
  if (desc.includes('netflix')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#111827] border border-[#374151] flex items-center justify-center text-[#E50914] shrink-0 shadow-xs font-black text-sm">
        N
      </div>
    );
  }
  if (desc.includes('swiggy')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#FC8019] flex items-center justify-center text-white shrink-0 shadow-xs">
        <UtensilsCrossed className="w-4 h-4" />
      </div>
    );
  }
  if (desc.includes('upwork')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#14A800] flex items-center justify-center text-white shrink-0 shadow-xs font-bold text-[11px] lowercase tracking-tighter">
        up
      </div>
    );
  }
  if (desc.includes('recharge') || desc.includes('mobile') || desc.includes('phone') || desc.includes('airtel') || desc.includes('jio')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center text-white shrink-0 shadow-xs">
        <Smartphone className="w-4 h-4" />
      </div>
    );
  }

  // Fallbacks by category
  if (cat.includes('food') || cat.includes('dining')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#EA580C] flex items-center justify-center text-white shrink-0 shadow-xs">
        <UtensilsCrossed className="w-4 h-4" />
      </div>
    );
  }
  if (cat.includes('shopping')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center text-white shrink-0 shadow-xs">
        <ShoppingBag className="w-4 h-4" />
      </div>
    );
  }
  if (cat.includes('utilities') || cat.includes('bill')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#CA8A04] flex items-center justify-center text-white shrink-0 shadow-xs">
        <Zap className="w-4 h-4 fill-white" />
      </div>
    );
  }
  if (cat.includes('transport') || cat.includes('travel')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#EA580C] flex items-center justify-center text-white shrink-0 shadow-xs">
        <Car className="w-4 h-4" />
      </div>
    );
  }
  if (cat.includes('entertainment')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-xs">
        <Gamepad2 className="w-4 h-4" />
      </div>
    );
  }
  if (cat.includes('health')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#E11D48] flex items-center justify-center text-white shrink-0 shadow-xs">
        <HeartPulse className="w-4 h-4" />
      </div>
    );
  }
  if (cat.includes('education')) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shrink-0 shadow-xs">
        <GraduationCap className="w-4 h-4" />
      </div>
    );
  }

  // Generic fallback
  return (
    <div className="w-8 h-8 rounded-lg bg-[#18272C] border border-[#24363B] flex items-center justify-center text-[#35E9A0] shrink-0 shadow-xs">
      <Receipt className="w-4 h-4" />
    </div>
  );
}

// Category badge and icon resolver
function getCategoryDisplay(category = '') {
  const cat = category.trim();
  const lower = cat.toLowerCase();

  if (lower.includes('food') || lower.includes('dining')) {
    return {
      label: 'Food & Dining',
      icon: (
        <div className="w-7 h-7 rounded-lg bg-[#EA580C] flex items-center justify-center text-white shrink-0 shadow-xs">
          <UtensilsCrossed className="w-3.5 h-3.5" />
        </div>
      )
    };
  }
  if (lower.includes('freelance')) {
    return {
      label: 'Freelance',
      icon: (
        <div className="w-7 h-7 rounded-lg bg-[#059669] flex items-center justify-center text-white shrink-0 shadow-xs">
          <Briefcase className="w-3.5 h-3.5" />
        </div>
      )
    };
  }
  if (lower.includes('shopping')) {
    return {
      label: 'Shopping',
      icon: (
        <div className="w-7 h-7 rounded-lg bg-[#7C3AED] flex items-center justify-center text-white shrink-0 shadow-xs">
          <ShoppingBag className="w-3.5 h-3.5" />
        </div>
      )
    };
  }
  if (lower.includes('utilities') || lower.includes('bills')) {
    return {
      label: 'Utilities',
      icon: (
        <div className="w-7 h-7 rounded-lg bg-[#CA8A04] flex items-center justify-center text-white shrink-0 shadow-xs">
          <Shield className="w-3.5 h-3.5" />
        </div>
      )
    };
  }
  if (lower.includes('transport')) {
    return {
      label: 'Transport',
      icon: (
        <div className="w-7 h-7 rounded-lg bg-[#EA580C] flex items-center justify-center text-white shrink-0 shadow-xs">
          <Car className="w-3.5 h-3.5" />
        </div>
      )
    };
  }
  if (lower.includes('salary')) {
    return {
      label: 'Salary',
      icon: (
        <div className="w-7 h-7 rounded-lg bg-[#087F5B] flex items-center justify-center text-white shrink-0 shadow-xs">
          <Building2 className="w-3.5 h-3.5" />
        </div>
      )
    };
  }
  if (lower.includes('entertainment')) {
    return {
      label: 'Entertainment',
      icon: (
        <div className="w-7 h-7 rounded-lg bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-xs">
          <Gamepad2 className="w-3.5 h-3.5" />
        </div>
      )
    };
  }
  if (lower.includes('health')) {
    return {
      label: 'Health',
      icon: (
        <div className="w-7 h-7 rounded-lg bg-[#E11D48] flex items-center justify-center text-white shrink-0 shadow-xs">
          <HeartPulse className="w-3.5 h-3.5" />
        </div>
      )
    };
  }
  if (lower.includes('education')) {
    return {
      label: 'Education',
      icon: (
        <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shrink-0 shadow-xs">
          <GraduationCap className="w-3.5 h-3.5" />
        </div>
      )
    };
  }

  return {
    label: cat || 'Other',
    icon: (
      <div className="w-7 h-7 rounded-lg bg-[#0D9488] flex items-center justify-center text-white shrink-0 shadow-xs">
        <Tags className="w-3.5 h-3.5" />
      </div>
    )
  };
}

export default function TransactionTable({
  transactions = [],
  loading = false,
  onViewDetails,
  onEdit,
  onDelete,
  onAddNew
}) {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Close action dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[760px]">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-[#24363B] bg-[#101A1D]/60 text-[#71848A] text-xs font-semibold uppercase tracking-wider select-none">
              <th className="py-4 px-6 font-medium">Date</th>
              <th className="py-4 px-6 font-medium">Description</th>
              <th className="py-4 px-6 font-medium">Category</th>
              <th className="py-4 px-6 font-medium text-right">Amount</th>
              <th className="py-4 px-6 font-medium text-center">Type</th>
              <th className="py-4 px-6 font-medium text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#24363B]/60">
            {loading ? (
              // Loading Skeleton Rows
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-6">
                    <div className="h-4 w-20 bg-[#18272C] rounded-md" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#18272C]" />
                      <div className="h-4 w-32 bg-[#18272C] rounded-md" />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#18272C]" />
                      <div className="h-4 w-24 bg-[#18272C] rounded-md" />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="h-4 w-16 bg-[#18272C] rounded-md ml-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="h-6 w-16 bg-[#18272C] rounded-md mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="h-6 w-6 bg-[#18272C] rounded-md ml-auto" />
                  </td>
                </tr>
              ))
            ) : transactions.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#18272C] border border-[#24363B] flex items-center justify-center text-[#71848A] mb-3">
                      <ArrowUpDown className="w-6 h-6 text-[#35E9A0]" />
                    </div>
                    <h3 className="text-base font-semibold text-[#F1F5F4]">
                      No transactions found
                    </h3>
                    <p className="text-xs text-[#71848A] mt-1 mb-5 text-center leading-relaxed">
                      No transactions match your current filters or search terms. Try adjusting them or record a new transaction.
                    </p>
                    {onAddNew && (
                      <button
                        onClick={onAddNew}
                        className="px-4 py-2 bg-[#35E9A0] text-[#0B1114] text-xs font-semibold rounded-xl hover:bg-[#4FFFB0] transition shadow-md cursor-pointer"
                      >
                        + Add Transaction
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              // Rendered Transaction Rows
              transactions.map((tx) => {
                const isIncome = tx.type === 'Income';
                const formattedDate = formatDate(tx.date) || 'Recent';
                const catDisplay = getCategoryDisplay(tx.category);
                const isMenuOpen = activeMenuId === tx._id;

                return (
                  <tr
                    key={tx._id}
                    className="hover:bg-[#18272C]/60 transition-colors duration-150 group"
                  >
                    {/* Date */}
                    <td className="py-4 px-6 text-xs sm:text-sm text-[#F1F5F4] whitespace-nowrap font-normal">
                      {formattedDate}
                    </td>

                    {/* Description */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {getMerchantIcon(tx.description, tx.category)}
                        <span className="text-sm font-medium text-[#F1F5F4] truncate max-w-[200px] sm:max-w-[280px]">
                          {tx.description || tx.category || 'Untitled'}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        {catDisplay.icon}
                        <span className="text-sm text-[#A5B4B8]">
                          {catDisplay.label}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <span
                        className={`text-sm font-semibold tracking-tight ${
                          isIncome ? 'text-[#35E9A0]' : 'text-[#FF667A]'
                        }`}
                      >
                        {isIncome ? '+ ' : '- '}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>

                    {/* Type Badge */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      {isIncome ? (
                        <span className="inline-flex px-3 py-1 rounded-md text-xs font-medium bg-[#123D32] border border-[#35E9A0]/30 text-[#35E9A0]">
                          Income
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1 rounded-md text-xs font-medium bg-[#3D1A22] border border-[#FF667A]/30 text-[#FF667A]">
                          Expense
                        </span>
                      )}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-4 px-6 text-right whitespace-nowrap relative">
                      <div className="inline-block relative">
                        <button
                          onClick={(e) => toggleMenu(e, tx._id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                            isMenuOpen
                              ? 'bg-[#203238] text-[#F1F5F4]'
                              : 'text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C]'
                          }`}
                          aria-label="Actions"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 mt-1 w-36 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-40 animate-in fade-in zoom-in-95 duration-150"
                          >
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onViewDetails && onViewDetails(tx);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#203238] transition cursor-pointer text-left"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#35E9A0]" />
                              <span>View details</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onEdit && onEdit(tx);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#203238] transition cursor-pointer text-left"
                            >
                              <Pencil className="w-3.5 h-3.5 text-[#45B7F5]" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onDelete && onDelete(tx);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#FF667A] hover:bg-[#3D1A22]/50 transition cursor-pointer text-left"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
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
