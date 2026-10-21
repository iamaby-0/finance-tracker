import React from 'react';
import { Plus, Target, BarChart2 } from 'lucide-react';

export default function QuickActions({
  onAddExpense,
  onAddIncome,
  onSetBudget,
  onViewReports
}) {
  const actions = [
    {
      id: 'add-expense',
      label: 'Add Expense',
      icon: Plus,
      chipBg: 'bg-[#123D32]',
      iconColor: 'text-[#35E9A0]',
      hoverBorder: 'hover:border-[#35E9A0]/40',
      hoverBg: 'hover:bg-[#123D32]/20',
      onClick: onAddExpense
    },
    {
      id: 'add-income',
      label: 'Add Income',
      icon: Plus,
      chipBg: 'bg-[#12323D]',
      iconColor: 'text-[#20D6C7]',
      hoverBorder: 'hover:border-[#20D6C7]/40',
      hoverBg: 'hover:bg-[#12323D]/20',
      onClick: onAddIncome
    },
    {
      id: 'set-budget',
      label: 'Set Budget',
      icon: Target,
      chipBg: 'bg-[#2B1B3D]',
      iconColor: 'text-[#B18AFF]',
      hoverBorder: 'hover:border-[#B18AFF]/40',
      hoverBg: 'hover:bg-[#2B1B3D]/20',
      onClick: onSetBudget
    },
    {
      id: 'view-reports',
      label: 'View Reports',
      icon: BarChart2,
      chipBg: 'bg-[#382F1B]',
      iconColor: 'text-[#F6C85F]',
      hoverBorder: 'hover:border-[#F6C85F]/40',
      hoverBg: 'hover:bg-[#382F1B]/20',
      onClick: onViewReports
    }
  ];

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight mb-3.5">
        Quick Actions
      </h3>

      {/* 4 Action Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-auto">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.onClick}
              className={`p-3 rounded-xl bg-[#18272C] border border-[#24363B] ${act.hoverBorder} ${act.hoverBg} flex flex-col items-center justify-center gap-2 transition-all duration-200 group cursor-pointer text-center`}
              aria-label={act.label}
            >
              {/* Circular Icon Chip */}
              <div
                className={`w-8 h-8 rounded-full ${act.chipBg} ${act.iconColor} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-4 h-4 stroke-[2.5]" />
              </div>
              {/* Label */}
              <span className="text-[11px] font-medium text-[#F1F5F4] group-hover:text-white transition leading-tight">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
