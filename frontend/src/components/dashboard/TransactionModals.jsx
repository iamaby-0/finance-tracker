import React, { useState } from 'react';
import { X, Plus, TrendingDown, TrendingUp, Target, Loader2 } from 'lucide-react';
import api from '../../services/api';

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
      setError(err.response?.data?.error || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#121E22] border border-[#24363B] rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#24363B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3D1A22] text-[#FF667A] flex items-center justify-center">
              <TrendingDown className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold text-[#F1F5F4]">Add New Expense</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-2.5 rounded-lg bg-[#3D1A22]/60 border border-[#FF667A]/30 text-xs text-[#FF667A]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
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
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('Salary');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !source) {
      setError('Please fill in amount and source');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await api.post('/income', {
        amount: Number(amount),
        source,
        category,
        date
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error adding income:', err);
      setError(err.response?.data?.error || 'Failed to add income');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#121E22] border border-[#24363B] rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#24363B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#123D32] text-[#35E9A0] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold text-[#F1F5F4]">Add New Income</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-2.5 rounded-lg bg-[#3D1A22]/60 border border-[#FF667A]/30 text-xs text-[#FF667A]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
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
              Source / Description
            </label>
            <input
              type="text"
              placeholder="e.g. Monthly Salary, Freelance project"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-sm text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-2.5 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
            >
              <option value="Salary">Salary</option>
              <option value="Freelancing">Freelancing</option>
              <option value="Investment">Investment Returns</option>
              <option value="Bonus">Bonus</option>
              <option value="Other">Other</option>
            </select>
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
      setError(err.response?.data?.error || err.message || 'Failed to set budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#121E22] border border-[#24363B] rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#24363B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2B1B3D] text-[#B18AFF] flex items-center justify-center">
              <Target className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold text-[#F1F5F4]">Set Category Budget</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-2.5 rounded-lg bg-[#3D1A22]/60 border border-[#FF667A]/30 text-xs text-[#FF667A]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
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
