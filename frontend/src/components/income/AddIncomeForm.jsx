import React, { useState } from 'react';
import { Landmark, Calendar, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function AddIncomeForm({ onSuccess }) {
  const [source, setSource] = useState('Salary');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const sources = [
    { value: 'Salary', label: 'Salary' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Business', label: 'Business' },
    { value: 'Investment', label: 'Investment' },
    { value: 'Dividends', label: 'Dividends' },
    { value: 'Rental', label: 'Rental' },
    { value: 'Parents', label: 'Parents' },
    { value: 'Gift', label: 'Gift' },
    { value: 'Other', label: 'Other' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMsg('');

      await api.post('/income', {
        source,
        amount: Number(amount),
        date: date || new Date().toISOString(),
        notes: notes.trim() || undefined,
        description: notes.trim() || source
      });

      setSuccessMsg('Income added successfully!');
      setAmount('');
      setNotes('');
      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error adding income:', err);
      const msg =
        (typeof err.response?.data?.message === 'string' && err.response.data.message) ||
        (typeof err.response?.data?.error === 'string' && err.response.data.error) ||
        (typeof err.response?.data?.error?.message === 'string' && err.response.data.error.message) ||
        (typeof err.message === 'string' && err.message) ||
        'Failed to add income';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-4 sm:p-5 h-full flex flex-col justify-between">
      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm sm:text-base font-semibold text-[#F1F5F4] tracking-tight">
          Add New Income
        </h3>
        {successMsg && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-[#35E9A0] bg-[#123D32] px-2 py-0.5 rounded-md animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {successMsg}
          </span>
        )}
      </div>

      {error && (
        <div className="mb-3 p-2 rounded-lg bg-[#3D1A22]/70 border border-[#FF667A]/30 text-xs text-[#FF667A]">
          {error}
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Source dropdown */}
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Source
            </label>
            <div className="relative">
              <Landmark className="w-4 h-4 text-[#35E9A0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full h-10 pl-9 pr-8 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] cursor-pointer appearance-none"
              >
                {sources.map((s) => (
                  <option key={s.value} value={s.value} className="bg-[#18272C] text-[#F1F5F4]">
                    {s.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#71848A]">
                ▼
              </div>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Amount
            </label>
            <div className="relative">
              <span className="text-sm font-semibold text-[#71848A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-10 pl-8 pr-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] transition"
                required
              />
            </div>
          </div>

          {/* Date input */}
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-[#71848A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] transition cursor-pointer [color-scheme:dark]"
                required
              />
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Notes (Optional)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-[#71848A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Add a note..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] transition"
              />
            </div>
          </div>
        </div>

        {/* Full-width Mint Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 sm:h-11 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition duration-200 cursor-pointer shadow-md hover:shadow-[#35E9A0]/20 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Add Income'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
