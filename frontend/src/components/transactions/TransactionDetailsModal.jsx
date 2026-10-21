import React from 'react';
import { X, Calendar, Tag, CreditCard, FileText, ArrowUpRight, ArrowDownLeft, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function TransactionDetailsModal({
  transaction,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) {
  if (!isOpen || !transaction) return null;

  const isIncome = transaction.type === 'Income';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#121E22] border border-[#24363B] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#24363B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isIncome
                  ? 'bg-[#123D32] border border-[#35E9A0]/30 text-[#35E9A0]'
                  : 'bg-[#3D1A22] border border-[#FF667A]/30 text-[#FF667A]'
              }`}
            >
              {isIncome ? (
                <ArrowDownLeft className="w-4 h-4" />
              ) : (
                <ArrowUpRight className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F1F5F4]">
                Transaction Details
              </h3>
              <p className="text-xs text-[#71848A]">
                {isIncome ? 'Income' : 'Expense'} Record
              </p>
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

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Amount Card */}
          <div className="p-4 rounded-xl bg-[#18272C] border border-[#24363B] text-center">
            <span className="text-xs text-[#71848A] uppercase font-semibold tracking-wider">
              Amount
            </span>
            <div
              className={`text-2xl font-bold mt-1 tracking-tight ${
                isIncome ? 'text-[#35E9A0]' : 'text-[#FF667A]'
              }`}
            >
              {isIncome ? '+ ' : '- '}
              {formatCurrency(transaction.amount)}
            </div>
            <div className="mt-2 inline-flex">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                  isIncome
                    ? 'bg-[#123D32] text-[#35E9A0] border-[#35E9A0]/30'
                    : 'bg-[#3D1A22] text-[#FF667A] border-[#FF667A]/30'
                }`}
              >
                {transaction.type}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-3">
            {/* Description */}
            <div className="flex items-center justify-between py-2 border-b border-[#24363B]/60 text-xs">
              <span className="text-[#71848A] flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#71848A]" /> Description
              </span>
              <span className="text-[#F1F5F4] font-semibold text-right max-w-[200px] truncate">
                {transaction.description || 'Untitled'}
              </span>
            </div>

            {/* Category / Source */}
            <div className="flex items-center justify-between py-2 border-b border-[#24363B]/60 text-xs">
              <span className="text-[#71848A] flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-[#71848A]" /> Category
              </span>
              <span className="text-[#F1F5F4] font-medium text-right">
                {transaction.category}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between py-2 border-b border-[#24363B]/60 text-xs">
              <span className="text-[#71848A] flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#71848A]" /> Date
              </span>
              <span className="text-[#F1F5F4] font-medium text-right">
                {formatDate(transaction.date)}
              </span>
            </div>

            {/* Payment Method (for expenses) */}
            {transaction.raw?.paymentMethod && (
              <div className="flex items-center justify-between py-2 border-b border-[#24363B]/60 text-xs">
                <span className="text-[#71848A] flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-[#71848A]" /> Payment Method
                </span>
                <span className="text-[#F1F5F4] font-medium text-right">
                  {transaction.raw.paymentMethod}
                </span>
              </div>
            )}

            {/* Notes */}
            {transaction.notes && (
              <div className="pt-2 text-xs">
                <span className="text-[#71848A] block mb-1">Notes</span>
                <p className="p-3 rounded-lg bg-[#18272C] text-[#A5B4B8] border border-[#24363B] text-xs leading-relaxed">
                  {transaction.notes}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-between border-t border-[#24363B]">
            <button
              onClick={() => {
                onClose();
                onDelete && onDelete(transaction);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-[#FF667A] hover:bg-[#3D1A22]/50 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C] rounded-xl transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onEdit && onEdit(transaction);
                }}
                className="px-4 py-2 text-xs font-semibold bg-[#18272C] hover:bg-[#203238] text-[#35E9A0] border border-[#35E9A0]/30 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
