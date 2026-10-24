import React, { useState } from 'react';
import { X, PlusCircle, Loader2 } from 'lucide-react';

export default function AddSavingsModal({ goal, isOpen, onClose, onConfirm, loading }) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !goal) return null;

  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  const formatINR = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const addVal = Number(amount);
    if (isNaN(addVal) || addVal <= 0) {
      setError('Please enter a valid positive amount to save');
      return;
    }

    try {
      await onConfirm(goal._id, {
        amount: addVal,
        note: note.trim()
      });
      setAmount('');
      setNote('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add savings');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-md max-h-[calc(100dvh-1.5rem)] my-auto overflow-y-auto rounded-2xl bg-[#121E22] border border-[#24363B] p-5 sm:p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#24363B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#123D32] flex items-center justify-center text-[#35E9A0]">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F1F5F4]">Add Savings</h3>
              <p className="text-[11px] text-[#71848A]">{goal.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Info Card */}
        <div className="p-3 rounded-xl bg-[#18272C] border border-[#24363B] grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[#71848A] block">Current Saved</span>
            <span className="font-bold text-[#35E9A0] text-sm mt-0.5 block">
              {formatINR(goal.currentAmount)}
            </span>
          </div>
          <div>
            <span className="text-[#71848A] block">Remaining</span>
            <span className="font-bold text-[#F1F5F4] text-sm mt-0.5 block">
              {formatINR(remaining)}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-[#3D1A22] border border-[#FF667A]/30 text-xs text-[#FF667A]">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Amount to Add (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71848A]">
                ₹
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                min="1"
                required
                className="w-full h-10 pl-7 pr-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. October monthly salary allocation"
              className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] transition"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl bg-[#18272C] hover:bg-[#203238] border border-[#24363B] text-xs font-semibold text-[#A5B4B8] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-10 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0B1114]" />
                  <span>Adding...</span>
                </>
              ) : (
                <span>Confirm Savings</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
