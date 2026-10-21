import React, { useState } from 'react';
import {
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Receipt,
  Gamepad2,
  Heart,
  MoreHorizontal,
  GraduationCap,
  Plane,
  Home,
  TrendingUp,
  Calendar,
  FileText,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import api from '../../services/api';

const CATEGORY_OPTIONS = [
  { value: 'Food', label: 'Food & Dining', icon: UtensilsCrossed },
  { value: 'Shopping', label: 'Shopping', icon: ShoppingBag },
  { value: 'Transport', label: 'Transport', icon: Car },
  { value: 'Bills', label: 'Bills & Utilities', icon: Receipt },
  { value: 'Entertainment', label: 'Entertainment', icon: Gamepad2 },
  { value: 'Health', label: 'Health & Fitness', icon: Heart },
  { value: 'Education', label: 'Education', icon: GraduationCap },
  { value: 'Travel', label: 'Travel', icon: Plane },
  { value: 'Rent', label: 'Rent', icon: Home },
  { value: 'Investment', label: 'Investment', icon: TrendingUp },
  { value: 'Other', label: 'Others', icon: MoreHorizontal }
];

export default function CreateBudgetForm({ onSuccess }) {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState(currentMonthStart);
  const [endDate, setEndDate] = useState(currentMonthEnd);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const selectedCategoryObj = CATEGORY_OPTIONS.find((c) => c.value === category) || CATEGORY_OPTIONS[0];
  const SelectedIcon = selectedCategoryObj.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid positive budget amount');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be earlier than start date');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMsg('');

      const sDate = new Date(startDate);
      const month = sDate.getMonth() + 1;
      const year = sDate.getFullYear();

      await api.post('/budget', {
        category,
        name: notes.trim() || `${selectedCategoryObj.label} Budget`,
        amount: Number(amount),
        startDate,
        endDate,
        month,
        year,
        notes: notes.trim() || undefined
      });

      setSuccessMsg('Budget created successfully!');
      setAmount('');
      setNotes('');
      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error creating budget:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to create budget'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 h-full flex flex-col justify-between">
      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight">
          Create New Budget
        </h3>
        {successMsg && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-[#35E9A0] bg-[#123D32] px-2 py-0.5 rounded-md animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {successMsg}
          </span>
        )}
      </div>

      {error && (
        <div className="mb-2.5 p-2 rounded-lg bg-[#3D1A22]/70 border border-[#FF667A]/30 text-xs text-[#FF667A]">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-2.5">
        <div className="space-y-2.5">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Category
            </label>
            <div className="relative">
              <SelectedIcon className="w-4 h-4 text-[#FF667A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 pl-9 pr-8 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] cursor-pointer appearance-none"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value} className="bg-[#18272C] text-[#F1F5F4]">
                    {c.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#71848A] text-[10px]">
                ▼
              </div>
            </div>
          </div>

          {/* Monthly Budget Amount */}
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Monthly Budget Amount
            </label>
            <div className="relative">
              <span className="text-xs font-semibold text-[#71848A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-9 pl-7 pr-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] transition"
                required
              />
            </div>
          </div>

          {/* Dates: 2 Columns (Start Date & End Date) */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-[#71848A] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-9 pl-8 pr-2 rounded-xl bg-[#18272C] border border-[#24363B] text-[11px] text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] transition cursor-pointer [color-scheme:dark]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
                End Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-[#71848A] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-9 pl-8 pr-2 rounded-xl bg-[#18272C] border border-[#24363B] text-[11px] text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] transition cursor-pointer [color-scheme:dark]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Notes (Optional)
            </label>
            <div className="relative">
              <FileText className="w-3.5 h-3.5 text-[#71848A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Add a note about this budget..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] transition"
              />
            </div>
          </div>
        </div>

        {/* Create Budget Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition duration-200 cursor-pointer shadow-md hover:shadow-[#35E9A0]/20 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Create Budget'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
