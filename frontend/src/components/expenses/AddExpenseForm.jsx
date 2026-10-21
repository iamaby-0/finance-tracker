import React, { useState } from 'react';
import { Calendar, UtensilsCrossed, ShoppingBag, Car, Zap, Gamepad2, HeartPulse, Tags, Loader2 } from 'lucide-react';
import api from '../../services/api';

const CATEGORY_OPTIONS = [
  { label: 'Food & Dining', value: 'Food', icon: UtensilsCrossed, color: '#FF667A' },
  { label: 'Shopping', value: 'Shopping', icon: ShoppingBag, color: '#FF8A48' },
  { label: 'Transport', value: 'Transport', icon: Car, color: '#F6C85F' },
  { label: 'Bills & Utilities', value: 'Bills', icon: Zap, color: '#20D6C7' },
  { label: 'Entertainment', value: 'Entertainment', icon: Gamepad2, color: '#45B7F5' },
  { label: 'Health & Fitness', value: 'Health', icon: HeartPulse, color: '#FF6EA7' },
  { label: 'Others', value: 'Other', icon: Tags, color: '#B18AFF' }
];

export default function AddExpenseForm({ onSuccess }) {
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const selectedCategoryObj =
    CATEGORY_OPTIONS.find((c) => c.value === category) || CATEGORY_OPTIONS[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a merchant or description');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        amount: numAmount,
        description: description.trim(),
        category,
        paymentMethod: 'UPI',
        date: new Date(date).toISOString(),
        notes: notes.trim() || undefined
      };

      await api.post('/expenses', payload);

      setSuccessMsg('Expense added successfully!');
      setAmount('');
      setDescription('');
      setNotes('');
      setDate(new Date().toISOString().split('T')[0]);

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to create expense:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to add expense. Please check your inputs.'
      );
    } finally {
      setLoading(false);
    }
  };

  const SelectedIcon = selectedCategoryObj.icon;

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 shadow-lg flex flex-col justify-between h-full">
      <div>
        <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
          Add New Expense
        </h3>
        <p className="text-xs text-[#71848A] mt-0.5 mb-3">
          Record a new expense
        </p>

        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-[#3D1A22] border border-[#FF667A]/40 text-xs text-[#FF667A]">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-[#123D32] border border-[#35E9A0]/40 text-xs text-[#35E9A0]">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 1. Category */}
          <div>
            <label className="block text-[11px] font-semibold text-[#A5B4B8] mb-1">
              Category
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#FF667A]">
                <SelectedIcon className="w-4 h-4" />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 pl-9 pr-7 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] transition cursor-pointer appearance-none"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value} className="bg-[#121E22] text-[#F1F5F4]">
                    {c.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#71848A] text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* 2. Amount */}
          <div>
            <label className="block text-[11px] font-semibold text-[#A5B4B8] mb-1">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71848A]">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-9 pl-7 pr-3 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] transition"
              />
            </div>
          </div>

          {/* 3. Date */}
          <div>
            <label className="block text-[11px] font-semibold text-[#A5B4B8] mb-1">
              Date
            </label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-[#71848A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-9 pl-8 pr-3 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] transition"
              />
            </div>
          </div>

          {/* 4. Merchant / Description */}
          <div>
            <label className="block text-[11px] font-semibold text-[#A5B4B8] mb-1">
              Merchant / Description
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Zomato, Groceries, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-9 px-3 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] transition"
            />
          </div>

          {/* 5. Notes (Optional) */}
          <div>
            <label className="block text-[11px] font-semibold text-[#A5B4B8] mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add a note..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] resize-none transition"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] font-bold text-xs shadow-[0_0_15px_rgba(53,233,160,0.25)] hover:shadow-[0_0_20px_rgba(53,233,160,0.4)] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Add Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
