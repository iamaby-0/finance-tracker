import React, { useState, useRef, useEffect } from 'react';
import {
  Utensils,
  ShoppingBag,
  Car,
  FileText,
  Gamepad,
  Heart,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  Coins,
  Sparkles,
  Receipt,
  Plane,
  MoreVertical,
  Trash2,
  Edit2
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const ICON_MAP = {
  Utensils,
  ShoppingBag,
  Car,
  FileText,
  Gamepad,
  Heart,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  Coins,
  Sparkles,
  Receipt,
  Plane
};

export default function CategoryCard({
  category,
  onEdit,
  onDelete
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const IconComponent = ICON_MAP[category.icon] || Utensils;
  const isExpense = category.type === 'Expense';

  return (
    <div className="rounded-xl bg-[#121E22] border border-[#24363B] p-3.5 flex flex-col justify-between hover:border-[#35E9A0]/40 transition-all duration-200 group relative">
      {/* Top Section: Icon, Name, Type Badge, and Actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Icon Container */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#24363B]/60 shadow-xs"
            style={{
              backgroundColor: category.color ? `${category.color}15` : '#18272C',
              color: category.color || '#35E9A0'
            }}
          >
            <IconComponent className="w-4 h-4 stroke-[2.2]" />
          </div>

          {/* Name & Badge */}
          <div className="min-w-0">
            <h4 className="text-[13px] font-bold text-[#F1F5F4] truncate tracking-tight leading-tight">
              {category.name}
            </h4>
            <span
              className={`inline-block px-2 py-0.5 mt-0.5 rounded-full text-[10px] font-medium tracking-wide ${
                isExpense
                  ? 'bg-[#2A161B] text-[#FF667A] border border-[#FF667A]/30'
                  : 'bg-[#123D32] text-[#35E9A0] border border-[#35E9A0]/30'
              }`}
            >
              {category.type}
            </span>
          </div>
        </div>

        {/* Action Menu (3 dots) */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-md text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C] transition-colors cursor-pointer"
            aria-label="Category options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-30 animate-in fade-in duration-100 text-xs">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(category);
                  }}
                  className="w-full px-3 py-1.5 flex items-center gap-2 text-left text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#203238] transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#35E9A0]" />
                  <span>Edit</span>
                </button>
              )}
              {onDelete && category.isCustom && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(category);
                  }}
                  className="w-full px-3 py-1.5 flex items-center gap-2 text-left text-[#FF667A] hover:bg-[#203238] transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
              {!category.isCustom && (
                <div className="px-3 py-1 text-[10px] text-[#71848A]">
                  Default category
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Middle: Amount & Percentage */}
      <div className="mt-3.5 flex items-baseline justify-between text-xs">
        <span className="text-sm font-bold text-[#F1F5F4]">
          {formatCurrency(category.amount || 0)}
        </span>
        <span className="text-[11px] font-semibold text-[#71848A]">
          {category.percentage || 0}%
        </span>
      </div>

      {/* Bottom: Thin Colored Progress Bar */}
      <div className="mt-2 h-1 w-full bg-[#18272C] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(100, Math.max(4, category.percentage || 0))}%`,
            backgroundColor: category.color || (isExpense ? '#FF667A' : '#35E9A0')
          }}
        />
      </div>
    </div>
  );
}
