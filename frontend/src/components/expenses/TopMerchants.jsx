import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, UtensilsCrossed, Car, Film, Wifi, ShoppingBag, Store } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_TOP_MERCHANTS = {
  'This Month': [
    {
      id: 'm1',
      name: 'Zomato',
      amount: 3240,
      transactions: 8,
      percentage: 15,
      barColor: '#FF667A',
      iconBg: 'bg-[#E23744]',
      icon: UtensilsCrossed
    },
    {
      id: 'm2',
      name: 'Amazon',
      amount: 2199,
      transactions: 4,
      percentage: 10,
      barColor: '#B18AFF',
      iconBg: 'bg-[#FF9900]',
      icon: ShoppingBag
    },
    {
      id: 'm3',
      name: 'IndianOil',
      amount: 1980,
      transactions: 5,
      percentage: 9,
      barColor: '#20D6C7',
      iconBg: 'bg-[#0284C7]',
      icon: Car
    },
    {
      id: 'm4',
      name: 'Jio',
      amount: 1230,
      transactions: 1,
      percentage: 6,
      barColor: '#45B7F5',
      iconBg: 'bg-[#1D4ED8]',
      icon: Wifi
    },
    {
      id: 'm5',
      name: 'PVR Cinemas',
      amount: 850,
      transactions: 2,
      percentage: 4,
      barColor: '#F6C85F',
      iconBg: 'bg-[#D97706]',
      icon: Film
    }
  ],
  'Last Month': [
    {
      id: 'm1',
      name: 'Swiggy',
      amount: 2890,
      transactions: 7,
      percentage: 14,
      barColor: '#FF667A',
      iconBg: 'bg-[#FC8019]',
      icon: UtensilsCrossed
    },
    {
      id: 'm2',
      name: 'Amazon',
      amount: 2450,
      transactions: 5,
      percentage: 11,
      barColor: '#B18AFF',
      iconBg: 'bg-[#FF9900]',
      icon: ShoppingBag
    },
    {
      id: 'm3',
      name: 'Shell Petrol',
      amount: 2100,
      transactions: 4,
      percentage: 9,
      barColor: '#20D6C7',
      iconBg: 'bg-[#0284C7]',
      icon: Car
    },
    {
      id: 'm4',
      name: 'Airtel',
      amount: 1199,
      transactions: 1,
      percentage: 5,
      barColor: '#45B7F5',
      iconBg: 'bg-[#E11D48]',
      icon: Wifi
    },
    {
      id: 'm5',
      name: 'Netflix',
      amount: 649,
      transactions: 1,
      percentage: 3,
      barColor: '#F6C85F',
      iconBg: 'bg-[#111827]',
      icon: Film
    }
  ],
  'This Year': [
    {
      id: 'm1',
      name: 'Amazon',
      amount: 32400,
      transactions: 38,
      percentage: 16,
      barColor: '#FF667A',
      iconBg: 'bg-[#FF9900]',
      icon: ShoppingBag
    },
    {
      id: 'm2',
      name: 'Zomato & Swiggy',
      amount: 24500,
      transactions: 56,
      percentage: 12,
      barColor: '#B18AFF',
      iconBg: 'bg-[#E23744]',
      icon: UtensilsCrossed
    },
    {
      id: 'm3',
      name: 'IndianOil Fuel',
      amount: 21800,
      transactions: 42,
      percentage: 10,
      barColor: '#20D6C7',
      iconBg: 'bg-[#0284C7]',
      icon: Car
    },
    {
      id: 'm4',
      name: 'Electricity Board',
      amount: 16400,
      transactions: 10,
      percentage: 8,
      barColor: '#45B7F5',
      iconBg: 'bg-[#D97706]',
      icon: Wifi
    },
    {
      id: 'm5',
      name: 'PVR & BookMyShow',
      amount: 9800,
      transactions: 18,
      percentage: 5,
      barColor: '#F6C85F',
      iconBg: 'bg-[#8B5CF6]',
      icon: Film
    }
  ]
};

export default function TopMerchants({
  merchants = null,
  selectedPeriod: initialPeriod = 'This Month',
  onPeriodChange
}) {
  const [period, setPeriod] = useState(initialPeriod);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const periods = ['This Month', 'Last Month', 'This Year'];

  useEffect(() => {
    if (initialPeriod) {
      setPeriod(initialPeriod);
    }
  }, [initialPeriod]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const merchantList =
    merchants && merchants.length > 0
      ? merchants
      : DEFAULT_TOP_MERCHANTS[period] || DEFAULT_TOP_MERCHANTS['This Month'];

  const handleSelectPeriod = (p) => {
    setPeriod(p);
    setDropdownOpen(false);
    if (onPeriodChange) {
      onPeriodChange(p);
    }
  };

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 shadow-lg flex flex-col justify-between h-full">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
            Top Merchants
          </h3>
          <p className="text-xs text-[#71848A] mt-0.5">
            Highest spending destinations
          </p>
        </div>

        {/* Dropdown Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18272C] border border-[#24363B] text-xs font-medium text-[#F1F5F4] hover:border-[#FF667A]/40 transition cursor-pointer"
          >
            <span>{period}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#71848A] transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-[#FF667A]' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
              {periods.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSelectPeriod(p)}
                  className={`w-full px-3 py-1.5 text-xs text-left transition cursor-pointer ${
                    period === p
                      ? 'text-[#FF667A] bg-[#3D1A22] font-semibold'
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

      {/* Merchants List */}
      <div className="space-y-3 mt-1">
        {merchantList.map((m) => {
          const Icon = m.icon || Store;

          return (
            <div key={m.id || m.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                {/* Left: Icon & Merchant Name */}
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className={`w-6 h-6 rounded-md ${
                      m.iconBg || 'bg-[#18272C]'
                    } flex items-center justify-center text-white shrink-0 shadow-xs text-xs font-bold`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-[#F1F5F4] truncate max-w-[110px] sm:max-w-[130px]">
                    {m.name}
                  </span>
                </div>

                {/* Right: Amount & Transaction Count */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-[#F1F5F4]">
                    {formatCurrency(m.amount)}
                  </span>
                  <span className="text-[11px] text-[#71848A] min-w-[70px] text-right">
                    {m.transactions} {m.transactions === 1 ? 'transaction' : 'transactions'}
                  </span>
                </div>
              </div>

              {/* Progress Bar Row */}
              <div className="flex items-center gap-2.5">
                <div className="flex-1 h-2 rounded-full bg-[#18272C] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, m.percentage * 3)}%`,
                      backgroundColor: m.barColor || '#FF667A'
                    }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-[#A5B4B8] w-7 text-right shrink-0">
                  {m.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
