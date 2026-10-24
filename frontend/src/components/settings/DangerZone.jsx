import React, { useState } from 'react';
import { Trash2, ChevronRight, AlertTriangle, Loader2 } from 'lucide-react';

export default function DangerZone({ onDeleteAccount }) {
  const [showModal, setShowModal] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleOpen = () => {
    setShowModal(true);
    setConfirmationInput('');
    setError(null);
  };

  const handleClose = () => {
    if (deleting) return;
    setShowModal(false);
    setConfirmationInput('');
    setError(null);
  };

  const handleConfirmDelete = async () => {
    if (confirmationInput !== 'DELETE') {
      setError('Please type DELETE in all caps to confirm.');
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      await onDeleteAccount('DELETE');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to delete account.');
      setDeleting(false);
    }
  };

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-2xl p-6 shadow-sm">
      {/* Title */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#FF667A]/15 text-[#FF667A] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Trash2 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#FF667A] tracking-tight">
            Danger Zone
          </h3>
          <p className="text-xs text-[#71848A] mt-0.5">
            Irreversible actions. Please proceed with caution.
          </p>
        </div>
      </div>

      {/* Delete Account Card */}
      <button
        type="button"
        onClick={handleOpen}
        className="w-full text-left rounded-xl border border-[#FF667A]/30 bg-[#161214] hover:bg-[#201518] hover:border-[#FF667A]/60 p-4 transition-all duration-200 flex items-center justify-between group cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-[#FF667A]/10 text-[#FF667A] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Trash2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#F1F5F4] group-hover:text-[#FF667A] transition-colors">
              Delete Account
            </div>
            <div className="text-[11px] text-[#A5B4B8] mt-0.5">
              Permanently delete your account and all data.
            </div>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-[#FF667A] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in">
          <div className="bg-[#121E22] border border-[#FF667A]/40 rounded-2xl p-5 sm:p-6 max-w-md w-[92%] sm:w-full shadow-2xl relative">
            <div className="w-12 h-12 rounded-xl bg-[#FF667A]/15 text-[#FF667A] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h4 className="text-base font-bold text-[#F1F5F4] text-center mb-1.5">
              Delete Account Permanently?
            </h4>
            <p className="text-xs text-[#A5B4B8] text-center leading-relaxed mb-4">
              This action <span className="text-[#FF667A] font-semibold">cannot be undone</span>. All your transactions, income, expense logs, budgets, financial goals, categories, and personal profile data will be permanently wiped.
            </p>

            {error && (
              <div className="mb-3.5 p-2.5 rounded-lg bg-[#FF667A]/15 border border-[#FF667A]/40 text-[#FF667A] text-xs text-center">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-[11px] text-[#A5B4B8] mb-1.5 font-medium">
                Type <span className="font-mono text-[#F1F5F4] font-bold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                disabled={deleting}
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-[#0B1114] border border-[#24363B] focus:border-[#FF667A] rounded-xl px-3.5 py-2 text-xs text-[#F1F5F4] font-mono outline-none tracking-wider text-center"
              />
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={deleting}
                onClick={handleClose}
                className="flex-1 py-2 rounded-xl border border-[#24363B] text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C] text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmationInput !== 'DELETE' || deleting}
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-[#FF667A] hover:bg-[#FF4D66] text-[#0B1114] text-xs font-bold transition shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Permanently</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
