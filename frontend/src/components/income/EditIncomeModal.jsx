import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function EditIncomeModal({ isOpen, onClose, income, onSuccess }) {
  const [source, setSource] = useState('Salary');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sources = [
    { value: 'Salary', label: 'Salary' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Investment', label: 'Investment' },
    { value: 'Business', label: 'Side Income' },
    { value: 'Other', label: 'Other' },
  ];

  useEffect(() => {
    if (income) {
      setSource(income.source || 'Salary');
      setAmount(income.amount || '');
      setDate(income.date ? new Date(income.date).toISOString().split('T')[0] : '');
      setNotes(income.notes || income.description || '');
      setError('');
    }
  }, [income]);

  if (!isOpen || !income) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Please provide a valid positive amount');
      return;
    }

    if (!income.isReal) {
      alert('This is a preview demonstration record.');
      onClose();
      return;
    }

    try {
      setLoading(true);
      setError('');

      await api.patch(`/income/${income._id}`, {
        source,
        amount: Number(amount),
        date: date || new Date().toISOString(),
        notes: notes.trim() || undefined,
        description: notes.trim() || source
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Error updating income:', err);
      setError(
        err.response?.data?.error?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to update income'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md max-h-[calc(100dvh-1.5rem)] flex flex-col bg-[#121E22] border border-[#24363B] rounded-2xl shadow-2xl p-5 sm:p-6 my-auto">
        <div className="flex items-center justify-between pb-3.5 sm:pb-4 border-b border-[#24363B] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#123D32] text-[#35E9A0] flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold text-[#F1F5F4] truncate">Edit Income Entry</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close edit income modal"
            className="p-1.5 rounded-lg text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C] transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3.5 p-2.5 rounded-lg bg-[#3D1A22]/70 border border-[#FF667A]/30 text-xs text-[#FF667A] shrink-0">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Source
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
            >
              {sources.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#18272C] text-[#F1F5F4]">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              step="any"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-sm text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
              required
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
              className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] [color-scheme:dark]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Monthly salary, Client project"
              className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
