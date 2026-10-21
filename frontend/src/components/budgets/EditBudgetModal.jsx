import React, { useState, useEffect } from 'react';
import { X, Target, Trash2, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function EditBudgetModal({
  isOpen,
  onClose,
  budget,
  onSuccess
}) {
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (budget) {
      setAmount(budget.amount || budget.budget || '');
      setStartDate(budget.startDate ? new Date(budget.startDate).toISOString().split('T')[0] : '');
      setEndDate(budget.endDate ? new Date(budget.endDate).toISOString().split('T')[0] : '');
      setNotes(budget.name || budget.notes || '');
      setError('');
    }
  }, [budget]);

  if (!isOpen || !budget) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Please provide a valid positive amount');
      return;
    }

    if (!budget._id) {
      alert('This is a demonstration preview budget.');
      onClose();
      return;
    }

    try {
      setLoading(true);
      setError('');

      await api.patch(`/budget/${budget._id}`, {
        amount: Number(amount),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        name: notes.trim() || undefined
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Error updating budget:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to update budget'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!budget._id) {
      alert('This is a demonstration preview budget.');
      onClose();
      return;
    }

    if (!window.confirm('Are you sure you want to delete this budget?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete(`/budget/${budget._id}`);
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Error deleting budget:', err);
      alert(err.response?.data?.error || 'Failed to delete budget');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#121E22] border border-[#24363B] rounded-2xl shadow-2xl p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#24363B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3D1A22] text-[#FF667A] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#F1F5F4]">
                Edit {budget.name || budget.category} Budget
              </h3>
              <p className="text-[11px] text-[#71848A]">
                Category: {budget.category || 'General'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3.5 p-2.5 rounded-lg bg-[#3D1A22]/70 border border-[#FF667A]/30 text-xs text-[#FF667A]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Monthly Budget Amount (₹)
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

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1">
              Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Monthly grocery limit"
              className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0]"
            />
          </div>

          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="px-3.5 h-10 rounded-xl bg-[#3D1A22]/80 hover:bg-[#FF667A] text-[#FF667A] hover:text-[#0B1114] border border-[#FF667A]/30 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              <span>Delete</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-10 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
