import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Share2,
  CalendarClock,
  ChevronRight,
  Check,
  X
} from 'lucide-react';

export default function ReportActions({
  onDownloadPDF,
  onDownloadExcel,
  reportData
}) {
  const [toastMessage, setToastMessage] = useState('');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleCadence, setScheduleCadence] = useState('Monthly');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleShare = async () => {
    const shareText = `My Finance Track Report - October 2026\nIncome: ₹85,000 | Expenses: ₹42,350 | Savings: ₹28,650\nView more at My Finance Track.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Finance Track Report',
          text: shareText,
          url: window.location.href
        });
        showToast('Report shared successfully!');
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard?.writeText(shareText);
    showToast('Report summary copied to clipboard!');
  };

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 flex flex-col justify-between h-full shadow-sm relative">
      {/* Header Row */}
      <div className="mb-3">
        <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
          Report Actions
        </h3>
        <p className="text-xs text-[#71848A] mt-0.5">
          Download, share or schedule your report
        </p>
      </div>

      {/* 4 Action Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-auto">
        {/* 1. Download PDF */}
        <button
          type="button"
          onClick={onDownloadPDF}
          className="p-3.5 rounded-xl bg-[#18272C] border border-[#24363B] hover:border-[#35E9A0]/50 transition-all flex items-center justify-between text-left group cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#123D32] border border-[#35E9A0]/30 flex items-center justify-center text-[#35E9A0] flex-shrink-0 shadow-xs">
              <FileText className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#F1F5F4] group-hover:text-[#35E9A0] transition-colors truncate">
                Download PDF
              </h4>
              <p className="text-[10px] text-[#71848A] truncate mt-0.5">
                Get a detailed PDF report
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#71848A] group-hover:text-[#35E9A0] group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1" />
        </button>

        {/* 2. Download Excel */}
        <button
          type="button"
          onClick={onDownloadExcel}
          className="p-3.5 rounded-xl bg-[#18272C] border border-[#24363B] hover:border-[#45B7F5]/50 transition-all flex items-center justify-between text-left group cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#152538] border border-[#45B7F5]/30 flex items-center justify-center text-[#45B7F5] flex-shrink-0 shadow-xs">
              <FileSpreadsheet className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#F1F5F4] group-hover:text-[#45B7F5] transition-colors truncate">
                Download Excel
              </h4>
              <p className="text-[10px] text-[#71848A] truncate mt-0.5">
                Export raw data
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#71848A] group-hover:text-[#45B7F5] group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1" />
        </button>

        {/* 3. Share Report */}
        <button
          type="button"
          onClick={handleShare}
          className="p-3.5 rounded-xl bg-[#18272C] border border-[#24363B] hover:border-[#B18AFF]/50 transition-all flex items-center justify-between text-left group cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#241833] border border-[#B18AFF]/30 flex items-center justify-center text-[#B18AFF] flex-shrink-0 shadow-xs">
              <Share2 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#F1F5F4] group-hover:text-[#B18AFF] transition-colors truncate">
                Share Report
              </h4>
              <p className="text-[10px] text-[#71848A] truncate mt-0.5">
                Share with others
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#71848A] group-hover:text-[#B18AFF] group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1" />
        </button>

        {/* 4. Schedule Report */}
        <button
          type="button"
          onClick={() => setScheduleModalOpen(true)}
          className="p-3.5 rounded-xl bg-[#18272C] border border-[#24363B] hover:border-[#F6C85F]/50 transition-all flex items-center justify-between text-left group cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#2A2315] border border-[#F6C85F]/30 flex items-center justify-center text-[#F6C85F] flex-shrink-0 shadow-xs">
              <CalendarClock className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#F1F5F4] group-hover:text-[#F6C85F] transition-colors truncate">
                Schedule Report
              </h4>
              <p className="text-[10px] text-[#71848A] truncate mt-0.5">
                Auto-generate reports
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#71848A] group-hover:text-[#F6C85F] group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1" />
        </button>
      </div>

      {/* Floating Feedback Toast */}
      {toastMessage && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#18272C] border border-[#35E9A0] text-[#35E9A0] px-4 py-2 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 z-30">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Schedule Report Configuration Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#121E22] border border-[#24363B] rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#24363B] pb-3">
              <div className="flex items-center gap-2.5">
                <CalendarClock className="w-5 h-5 text-[#F6C85F]" />
                <h3 className="text-sm font-bold text-[#F1F5F4]">Schedule Report Delivery</h3>
              </div>
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="text-[#71848A] hover:text-[#F1F5F4] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#A5B4B8] font-medium block mb-1">Cadence Frequency</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Weekly', 'Monthly', 'Quarterly'].map((cadence) => (
                    <button
                      key={cadence}
                      type="button"
                      onClick={() => setScheduleCadence(cadence)}
                      className={`py-2 px-3 rounded-lg border text-center transition cursor-pointer ${
                        scheduleCadence === cadence
                          ? 'bg-[#15372F] border-[#35E9A0] text-[#35E9A0] font-semibold'
                          : 'bg-[#18272C] border-[#24363B] text-[#A5B4B8] hover:text-[#F1F5F4]'
                      }`}
                    >
                      {cadence}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[#A5B4B8] font-medium block mb-1">Delivery Format</label>
                <input
                  type="text"
                  disabled
                  value="PDF Summary & CSV Export"
                  className="w-full bg-[#18272C] border border-[#24363B] rounded-lg px-3 py-2 text-[#71848A]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setScheduleModalOpen(false);
                  showToast(`Reports scheduled: ${scheduleCadence} auto-generation enabled!`);
                }}
                className="flex-1 py-2 px-4 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Confirm Schedule
              </button>
              <button
                type="button"
                onClick={() => setScheduleModalOpen(false)}
                className="py-2 px-4 rounded-xl bg-[#18272C] border border-[#24363B] text-[#A5B4B8] hover:text-[#F1F5F4] text-xs transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
