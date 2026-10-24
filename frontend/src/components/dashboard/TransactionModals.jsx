import React, { useState } from 'react';
import { X, Plus, TrendingDown, TrendingUp, Target, Loader2 } from 'lucide-react';
import api from '../../services/api';

const getErrorMessage = (err, fallback) => {
  if (!err) return fallback;
  if (typeof err === 'string') return err;
  if (typeof err.response?.data?.message === 'string') return err.response.data.message;
  if (typeof err.response?.data?.error === 'string') return err.response.data.error;
  if (typeof err.response?.data?.error?.message === 'string') return err.response.data.error.message;
  if (typeof err.message === 'string') return err.message;
  return fallback;
};

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

export function AddExpenseModal({ isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !description) {
      setError('Please fill in amount and description');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await api.post('/expenses', {
        amount: Number(amount),
        description,
        category,
        paymentMethod,
        date
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error adding expense:', err);
      setError(getErrorMessage(err, 'Failed to add expense'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md max-h-[calc(100dvh-1.5rem)] flex flex-col bg-[#121E22] border border-[#24363B] rounded-2xl shadow-2xl p-5 sm:p-6 my-auto">
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#24363B] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3D1A22] text-[#FF667A] flex items-center justify-center shrink-0">
              <TrendingDown className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold text-[#F1F5F4] truncate">Add New Expense</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close add expense modal"
            className="p-1.5 rounded-lg text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C] transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-[#3D1A22]/60 border border-[#FF667A]/30 text-xs text-[#FF667A] shrink-0">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 480"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-sm text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Description / Merchant
            </label>
            <input
              type="text"
              placeholder="e.g. Zomato, Amazon, Grocery"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-sm text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
              >
                <option value="Food">Food & Dining</option>
                <option value="Shopping">Shopping</option>
                <option value="Transport">Transport</option>
                <option value="Bills">Bills & Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health & Fitness</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
              >
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Cash">Cash</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#FF667A] hover:bg-[#ff7d8f] text-[#0B1114] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AddIncomeModal({ isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('Salary');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await api.post('/income', {
        amount: numAmount,
        source,
        description: description.trim() || source,
        notes: description.trim() || source,
        date
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error adding income:', err);
      setError(getErrorMessage(err, 'Failed to add income'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md max-h-[calc(100dvh-1.5rem)] flex flex-col bg-[#121E22] border border-[#24363B] rounded-2xl shadow-2xl p-5 sm:p-6 my-auto">
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#24363B] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#123D32] text-[#35E9A0] flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold text-[#F1F5F4] truncate">Add New Income</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close add income modal"
            className="p-1.5 rounded-lg text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C] transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-[#3D1A22]/60 border border-[#FF667A]/30 text-xs text-[#FF667A] shrink-0">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 70000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-sm text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Source / Category
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full h-10 px-2.5 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
            >
              {INCOME_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Description / Name <span className="text-[#71848A] font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. YouTube, AdSense, Client payment"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-sm text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Record Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SetBudgetModal({ isOpen, onClose, onSuccess }) {
  const [category, setCategory] = useState('Food & Dining');
  const [amount, setAmount] = useState('');
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) {
      setError('Please provide a budget amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await api.post('/budget', {
        category,
        amount: Number(amount),
        month: Number(month),
        year: Number(year)
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error setting budget:', err);
      setError(getErrorMessage(err, 'Failed to set budget'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md max-h-[calc(100dvh-1.5rem)] flex flex-col bg-[#121E22] border border-[#24363B] rounded-2xl shadow-2xl p-5 sm:p-6 my-auto">
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#24363B] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2B1B3D] text-[#B18AFF] flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold text-[#F1F5F4] truncate">Set Category Budget</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close set budget modal"
            className="p-1.5 rounded-lg text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C] transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-[#3D1A22]/60 border border-[#FF667A]/30 text-xs text-[#FF667A] shrink-0">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-2.5 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
            >
              <option value="Food & Dining">Food & Dining</option>
              <option value="Shopping">Shopping</option>
              <option value="Transport">Transport</option>
              <option value="Bills & Utilities">Bills & Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health & Fitness">Health & Fitness</option>
              <option value="Overall">Overall Monthly Budget</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Monthly Budget Limit (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 15000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-sm text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
                Month
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
                Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#B18AFF] hover:bg-[#c4a6ff] text-[#0B1114] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
