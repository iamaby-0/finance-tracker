import React, { useState, useEffect } from 'react';
import { X, Loader2, Pencil } from 'lucide-react';
import api from '../../services/api';

const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Health',
  'Education',
  'Travel',
  'Rent',
  'Investment',
  'Other'
];

const INCOME_SOURCES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Dividends',
  'Rental',
  'Parents',
  'Gift',
  'Other'
];

const PAYMENT_METHODS = ['UPI', 'Debit Card', 'Bank Transfer', 'Cash', 'Other'];

export default function EditTransactionModal({ transaction, isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount?.toString() || '');
      setDescription(transaction.description || '');
      setCategory(transaction.category || (transaction.type === 'Income' ? 'Salary' : 'Food'));
      setPaymentMethod(transaction.raw?.paymentMethod || 'UPI');
      if (transaction.date) {
        const d = new Date(transaction.date);
        setDate(!isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '');
      }
      setNotes(transaction.notes || '');
      setError('');
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const isIncome = transaction.type === 'Income';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    try {
      setLoading(true);

      if (!isIncome) {
        const payload = {
          amount: numAmount,
          description: description.trim(),
          category,
          paymentMethod,
          date: new Date(date).toISOString(),
          notes: notes.trim() || undefined
        };
        await api.patch(`/expenses/${transaction._id}`, payload);
      } else {
        const payload = {
          amount: numAmount,
          source: category,
          description: description.trim(),
          notes: notes.trim() || undefined,
          date: new Date(date).toISOString()
        };
        await api.patch(`/income/${transaction._id}`, payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to update transaction:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to update transaction. Please check inputs.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[calc(100dvh-1.5rem)] flex flex-col bg-[#121E22] border border-[#24363B] rounded-2xl shadow-2xl my-auto">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#24363B] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#18272C] border border-[#35E9A0]/30 flex items-center justify-center text-[#35E9A0] shrink-0">
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F1F5F4] truncate">
                Edit {isIncome ? 'Income' : 'Expense'}
              </h3>
              <p className="text-xs text-[#71848A]">Update transaction details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C] transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto pr-2">
          {error && (
            <div className="p-3 rounded-xl bg-[#3D1A22]/70 border border-[#FF667A]/40 text-xs text-[#FF667A] shrink-0">
              {error}
            </div>
          )}

          {/* Amount and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
                Amount (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#71848A]">
                  ₹
                </span>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-10 pl-7 pr-3 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0]"
                />
              </div>
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
                className="w-full h-10 px-3 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Description / Merchant *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-10 px-3 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
            />
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
                {isIncome ? 'Source *' : 'Category *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
              >
                {!isIncome
                  ? EXPENSE_CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#121E22] text-[#F1F5F4]">
                        {c}
                      </option>
                    ))
                  : INCOME_SOURCES.map((s) => (
                      <option key={s} value={s} className="bg-[#121E22] text-[#F1F5F4]">
                        {s}
                      </option>
                    ))}
              </select>
            </div>

            {!isIncome && (
              <div>
                <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-10 px-3 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m} className="bg-[#121E22] text-[#F1F5F4]">
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] resize-none"
            />
          </div>

          {/* Footer Actions */}
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
