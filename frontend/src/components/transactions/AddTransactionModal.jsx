import React, { useState } from 'react';
import { X, Loader2, PlusCircle } from 'lucide-react';
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

export default function AddTransactionModal({ isOpen, onClose, onSuccess }) {
  const [type, setType] = useState('Expense'); // 'Expense' or 'Income'
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'Income') {
      setCategory('Salary');
    } else {
      setCategory('Food');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description for the transaction');
      return;
    }

    try {
      setLoading(true);

      if (type === 'Expense') {
        const payload = {
          amount: numAmount,
          description: description.trim(),
          category,
          paymentMethod,
          date: new Date(date).toISOString(),
          notes: notes.trim() || undefined
        };
        await api.post('/expenses', payload);
      } else {
        const payload = {
          amount: numAmount,
          source: category,
          description: description.trim(),
          notes: notes.trim() || undefined,
          date: new Date(date).toISOString()
        };
        await api.post('/income', payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to create transaction:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to save transaction. Please check your inputs.'
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
            <div className="w-8 h-8 rounded-lg bg-[#123D32] border border-[#35E9A0]/30 flex items-center justify-center text-[#35E9A0] shrink-0">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F1F5F4] truncate">Add Transaction</h3>
              <p className="text-xs text-[#71848A]">Record a new financial transaction</p>
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

          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#101A1D] rounded-xl border border-[#24363B]">
              <button
                type="button"
                onClick={() => handleTypeChange('Expense')}
                className={`py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  type === 'Expense'
                    ? 'bg-[#3D1A22] text-[#FF667A] border border-[#FF667A]/40'
                    : 'text-[#A5B4B8] hover:text-[#F1F5F4]'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('Income')}
                className={`py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  type === 'Income'
                    ? 'bg-[#123D32] text-[#35E9A0] border border-[#35E9A0]/40'
                    : 'text-[#A5B4B8] hover:text-[#F1F5F4]'
                }`}
              >
                Income
              </button>
            </div>
          </div>

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
              placeholder={type === 'Expense' ? 'e.g., Zomato, Amazon, Uber' : 'e.g., Salary, Freelance project'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-10 px-3 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0]"
            />
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
                {type === 'Expense' ? 'Category *' : 'Source *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 bg-[#18272C] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
              >
                {type === 'Expense'
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

            {type === 'Expense' && (
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
              placeholder="Additional remarks or tags..."
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
              <span>Save Transaction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
