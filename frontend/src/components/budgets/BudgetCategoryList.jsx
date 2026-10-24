import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Receipt,
  Gamepad2,
  Heart,
  MoreHorizontal,
  Briefcase,
  GraduationCap,
  Plane,
  Home,
  TrendingUp
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_CATEGORIES = [
  {
    id: 'food',
    name: 'Food & Dining',
    category: 'Food',
    spent: 11850,
    budget: 15000,
    percentage: 79,
    status: 'On Track',
    color: '#FF667A',
    iconBg: 'bg-[#3D1A22]',
    iconColor: 'text-[#FF667A]',
    icon: UtensilsCrossed
  },
  {
    id: 'shopping',
    name: 'Shopping',
    category: 'Shopping',
    spent: 8500,
    budget: 10000,
    percentage: 85,
    status: 'Near Limit',
    color: '#B18AFF',
    iconBg: 'bg-[#2B1B3D]',
    iconColor: 'text-[#B18AFF]',
    icon: ShoppingBag
  },
  {
    id: 'transport',
    name: 'Transport',
    category: 'Transport',
    spent: 5930,
    budget: 8000,
    percentage: 74,
    status: 'On Track',
    color: '#20D6C7',
    iconBg: 'bg-[#142C2F]',
    iconColor: 'text-[#20D6C7]',
    icon: Car
  },
  {
    id: 'bills',
    name: 'Bills & Utilities',
    category: 'Bills',
    spent: 6200,
    budget: 7000,
    percentage: 89,
    status: 'Near Limit',
    color: '#F6C85F',
    iconBg: 'bg-[#382818]',
    iconColor: 'text-[#F6C85F]',
    icon: Receipt
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    category: 'Entertainment',
    spent: 3800,
    budget: 5000,
    percentage: 76,
    status: 'On Track',
    color: '#FF66B2',
    iconBg: 'bg-[#3D1B2E]',
    iconColor: 'text-[#FF66B2]',
    icon: Gamepad2
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    category: 'Health',
    spent: 2400,
    budget: 4000,
    percentage: 60,
    status: 'On Track',
    color: '#FF85A2',
    iconBg: 'bg-[#3D1B24]',
    iconColor: 'text-[#FF85A2]',
    icon: Heart
  },
  {
    id: 'others',
    name: 'Others',
    category: 'Other',
    spent: 2970,
    budget: 5000,
    percentage: 59,
    status: 'On Track',
    color: '#9F7AEA',
    iconBg: 'bg-[#251F3D]',
    iconColor: 'text-[#9F7AEA]',
    icon: MoreHorizontal
  }
];

export const getCategoryConfig = (category = '') => {
  const cat = (category || '').toLowerCase();

  if (cat.includes('food') || cat.includes('dining')) {
    return {
      displayName: 'Food & Dining',
      icon: UtensilsCrossed,
      color: '#FF667A',
      iconBg: 'bg-[#3D1A22]',
      iconColor: 'text-[#FF667A]'
    };
  }
  if (cat.includes('shop')) {
    return {
      displayName: 'Shopping',
      icon: ShoppingBag,
      color: '#B18AFF',
      iconBg: 'bg-[#2B1B3D]',
      iconColor: 'text-[#B18AFF]'
    };
  }
  if (cat.includes('trans') || cat.includes('travel')) {
    return {
      displayName: cat.includes('travel') ? 'Travel' : 'Transport',
      icon: cat.includes('travel') ? Plane : Car,
      color: '#20D6C7',
      iconBg: 'bg-[#142C2F]',
      iconColor: 'text-[#20D6C7]'
    };
  }
  if (cat.includes('bill') || cat.includes('util')) {
    return {
      displayName: 'Bills & Utilities',
      icon: Receipt,
      color: '#F6C85F',
      iconBg: 'bg-[#382818]',
      iconColor: 'text-[#F6C85F]'
    };
  }
  if (cat.includes('entertain')) {
    return {
      displayName: 'Entertainment',
      icon: Gamepad2,
      color: '#FF66B2',
      iconBg: 'bg-[#3D1B2E]',
      iconColor: 'text-[#FF66B2]'
    };
  }
  if (cat.includes('health') || cat.includes('fit')) {
    return {
      displayName: 'Health & Fitness',
      icon: Heart,
      color: '#FF85A2',
      iconBg: 'bg-[#3D1B24]',
      iconColor: 'text-[#FF85A2]'
    };
  }
  if (cat.includes('edu')) {
    return {
      displayName: 'Education',
      icon: GraduationCap,
      color: '#45B7F5',
      iconBg: 'bg-[#182C3D]',
      iconColor: 'text-[#45B7F5]'
    };
  }
  if (cat.includes('rent')) {
    return {
      displayName: 'Rent',
      icon: Home,
      color: '#FFAA5C',
      iconBg: 'bg-[#382818]',
      iconColor: 'text-[#FFAA5C]'
    };
  }
  if (cat.includes('invest')) {
    return {
      displayName: 'Investment',
      icon: TrendingUp,
      color: '#35E9A0',
      iconBg: 'bg-[#123D32]',
      iconColor: 'text-[#35E9A0]'
    };
  }
  return {
    displayName: category || 'Others',
    icon: MoreHorizontal,
    color: '#9F7AEA',
    iconBg: 'bg-[#251F3D]',
    iconColor: 'text-[#9F7AEA]'
  };
};

export default function BudgetCategoryList({
  categories = null,
  onEditBudget,
  onViewAll
}) {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate('/categories');
    }
  };

  const items = (categories && categories.length > 0) ? categories : DEFAULT_CATEGORIES;

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight">
          Budget by Category
        </h3>
        <button
          onClick={handleViewAll}
          className="text-xs font-semibold text-[#35E9A0] hover:text-[#4FFFB0] hover:underline transition cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Category Rows */}
      <div className="space-y-3.5 flex-1 overflow-y-auto scrollbar-none pr-0.5">
        {items.map((item) => {
          const Icon = item.icon || UtensilsCrossed;
          const pct = item.percentage ?? (item.budget > 0 ? Math.round((item.spent / item.budget) * 100) : 0);

          let status = item.status;
          if (!status) {
            if (pct > 100) status = 'Over Budget';
            else if (pct >= 80) status = 'Near Limit';
            else status = 'On Track';
          }

          let badgeStyle = 'border-[#35E9A0]/30 text-[#35E9A0] bg-[#123D32]/40';
          if (status === 'Near Limit') {
            badgeStyle = 'border-[#F6C85F]/30 text-[#F6C85F] bg-[#382818]/40';
          } else if (status === 'Over Budget') {
            badgeStyle = 'border-[#FF667A]/30 text-[#FF667A] bg-[#3D1A22]/40';
          }

          return (
            <div
              key={item.id || item.name}
              onClick={() => onEditBudget && onEditBudget(item)}
              className="group cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                {/* Left: Icon & Name + Spent/Budget */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg ${item.iconBg || 'bg-[#18272C]'} ${item.iconColor || 'text-[#35E9A0]'} flex items-center justify-center shrink-0 border border-white/5 shadow-xs`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#F1F5F4] group-hover:text-[#35E9A0] transition truncate">
                      {item.name || item.category}
                    </p>
                    <p className="text-[11px] text-[#71848A] whitespace-nowrap">
                      {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
                    </p>
                  </div>
                </div>

                {/* Right: Percentage & Status Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-semibold text-[#A5B4B8] w-7 text-right">
                    {pct}%
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${badgeStyle} whitespace-nowrap`}
                  >
                    {status}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-[#18272C] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(pct, 100)}%`,
                    backgroundColor: item.color || '#35E9A0'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
