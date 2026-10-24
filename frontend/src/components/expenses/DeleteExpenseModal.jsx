import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function DeleteExpenseModal({ expense, isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !expense) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');
      await api.delete(`/expenses/${expense._id}`);
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Failed to delete expense:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to delete expense. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-md max-h-[calc(100dvh-1.5rem)] bg-[#121E22] border border-[#24363B] rounded-2xl shadow-2xl p-5 sm:p-6 my-auto overflow-y-auto">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#3D1A22] border border-[#FF667A]/30 flex items-center justify-center text-[#FF667A] shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-[#F1F5F4]">
              Delete Expense?
            </h3>
            <p className="text-xs text-[#A5B4B8] mt-1.5 leading-relaxed">
              Are you sure you want to permanently delete this expense of{' '}
              <span className="font-semibold text-[#FF667A]">
                {formatCurrency(expense.amount)}
              </span>{' '}
              for <span className="font-semibold text-[#F1F5F4]">{expense.description || expense.category}</span> on{' '}
              {formatDate(expense.date)}?
            </p>

            {error && (
              <div className="mt-3 p-2.5 rounded-lg bg-[#3D1A22] border border-[#FF667A]/40 text-xs text-[#FF667A]">
                {error}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C] rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-5 py-2 text-xs font-bold bg-[#FF667A] hover:bg-[#ff4f67] text-white rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
