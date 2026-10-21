import React, { useState, useEffect } from 'react';
import { X, Loader2, Pencil } from 'lucide-react';
import api from '../../services/api';

const CATEGORIES = [
  { label: 'Food & Dining', value: 'Food' },
  { label: 'Shopping', value: 'Shopping' },
  { label: 'Transport', value: 'Transport' },
  { label: 'Bills & Utilities', value: 'Bills' },
  { label: 'Entertainment', value: 'Entertainment' },
  { label: 'Health & Fitness', value: 'Health' },
  { label: 'Others', value: 'Other' }
];

export default function EditExpenseModal({ expense, isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount?.toString() || '');
      setDescription(expense.description || '');
      setCategory(expense.category || 'Food');
      if (expense.date) {
        const d = new Date(expense.date);
        setDate(!isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '');
      }
      setNotes(expense.notes || '');
      setError('');
    }
  }, [expense]);

  if (!isOpen || !expense) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        amount: numAmount,
        description: description.trim(),
        category,
        date: new Date(date).toISOString(),
        notes: notes.trim() || undefined
      };

      await api.patch(`/expenses/${expense._id}`, payload);

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Failed to update expense:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to update expense. Please check your inputs.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#121E22] border border-[#24363B] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#24363B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3D1A22] border border-[#FF667A]/30 flex items-center justify-center text-[#FF667A]">
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F1F5F4]">Edit Expense</h3>
              <p className="text-xs text-[#71848A]">Update expense details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C] transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-[#3D1A22] border border-[#FF667A]/40 text-xs text-[#FF667A]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] transition"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} className="bg-[#121E22] text-[#F1F5F4]">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
                Amount (₹) *
              </label>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-10 px-3 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 px-3 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Merchant / Description *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-10 px-3 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] resize-none transition"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#24363B]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C] rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
