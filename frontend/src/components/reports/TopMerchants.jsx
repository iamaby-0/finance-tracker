import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Fuel,
  Film,
  Smartphone,
  Utensils,
  ChevronDown
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_MERCHANTS = [
  {
    id: 1,
    name: 'Zomato',
    amount: 3240,
    percentage: 15,
    icon: Utensils,
    iconBg: 'bg-[#2A161B]',
    iconColor: 'text-[#FF667A]',
    barColor: 'bg-[#FF667A]'
  },
  {
    id: 2,
    name: 'Amazon',
    amount: 2199,
    percentage: 10,
    icon: ShoppingBag,
    iconBg: 'bg-[#2A2315]',
    iconColor: 'text-[#F6C85F]',
    barColor: 'bg-[#B18AFF]'
  },
  {
    id: 3,
    name: 'IndianOil',
    amount: 1980,
    percentage: 9,
    icon: Fuel,
    iconBg: 'bg-[#152538]',
    iconColor: 'text-[#45B7F5]',
    barColor: 'bg-[#45B7F5]'
  },
  {
    id: 4,
    name: 'Jio',
    amount: 1230,
    percentage: 6,
    icon: Smartphone,
    iconBg: 'bg-[#123832]',
    iconColor: 'text-[#20D6C7]',
    barColor: 'bg-[#20D6C7]'
  },
  {
    id: 5,
    name: 'PVR Cinemas',
    amount: 850,
    percentage: 4,
    icon: Film,
    iconBg: 'bg-[#2E2012]',
    iconColor: 'text-[#FF8A48]',
    barColor: 'bg-[#F6C85F]'
  }
];

export default function TopMerchants({
  merchants = null,
  selectedPeriod = 'This Month',
  onPeriodChange
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const items = merchants && merchants.length > 0 ? merchants : DEFAULT_MERCHANTS;

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 flex flex-col justify-between h-full shadow-sm">
      {/* Header Row: Title & Period Dropdown */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
            Top Merchants
          </h3>
          <p className="text-xs text-[#71848A] mt-0.5">
            Highest spending merchants
          </p>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18272C] border border-[#24363B] text-xs font-medium text-[#F1F5F4] hover:border-[#35E9A0]/50 transition cursor-pointer"
          >
            <span>{selectedPeriod}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#71848A] transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-[#35E9A0]' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-30 animate-in fade-in duration-100">
              {['This Month', 'Last Month', 'This Year'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    if (onPeriodChange) onPeriodChange(p);
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-xs text-left transition cursor-pointer ${
                    selectedPeriod === p
                      ? 'text-[#35E9A0] bg-[#15372F] font-semibold'
                      : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#203238]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Merchant Rows */}
      <div className="space-y-3.5 my-auto">
        {items.map((m) => {
          const Icon = m.icon || ShoppingBag;

          return (
            <div key={m.id || m.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 border border-[#24363B]/60 ${
                      m.iconBg || 'bg-[#18272C]'
                    } ${m.iconColor || 'text-[#35E9A0]'}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-[#F1F5F4] truncate">
                    {m.name}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-bold text-[#F1F5F4]">
                    {formatCurrency(m.amount)}
                  </span>
                  <span className="text-[11px] text-[#71848A] w-7 text-right">
                    {m.percentage}%
                  </span>
                </div>
              </div>

              {/* Horizontal Progress Bar */}
              <div className="h-1.5 w-full bg-[#18272C] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    m.barColor || 'bg-[#35E9A0]'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, m.percentage * 3.5))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
