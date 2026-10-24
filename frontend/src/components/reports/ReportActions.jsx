import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Share2,
  CalendarClock,
  Check,
  X
} from 'lucide-react';

export default function ReportActions({
  onDownloadPDF,
  onDownloadExcel
}) {
  const [toastMessage, setToastMessage] = useState('');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleCadence, setScheduleCadence] = useState('Monthly');
  const [hoveredAction, setHoveredAction] = useState(null);

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

  const actionButtons = [
    {
      id: 'pdf',
      name: 'PDF',
      fullTitle: 'Download PDF',
      icon: FileText,
      accentColor: '#35E9A0',
      bgColor: 'bg-[#123D32]',
      iconColor: 'text-[#35E9A0]',
      onClick: onDownloadPDF,
    },
    {
      id: 'excel',
      name: 'Excel',
      fullTitle: 'Download Excel',
      icon: FileSpreadsheet,
      accentColor: '#45B7F5',
      bgColor: 'bg-[#152538]',
      iconColor: 'text-[#45B7F5]',
      onClick: onDownloadExcel,
    },
    {
      id: 'share',
      name: 'Share',
      fullTitle: 'Share Report',
      icon: Share2,
      accentColor: '#B18AFF',
      bgColor: 'bg-[#241833]',
      iconColor: 'text-[#B18AFF]',
      onClick: handleShare,
    },
    {
      id: 'schedule',
      name: 'Schedule',
      fullTitle: 'Schedule Report',
      icon: CalendarClock,
      accentColor: '#F6C85F',
      bgColor: 'bg-[#2A2315]',
      iconColor: 'text-[#F6C85F]',
      onClick: () => setScheduleModalOpen(true),
    },
  ];

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 flex flex-col justify-between h-full shadow-sm relative overflow-visible">
      {/* Header Row */}
      <div className="mb-2">
        <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
          Report Actions
        </h3>
        <p className="text-xs text-[#71848A] mt-0.5">
          Download, share or schedule your report
        </p>
      </div>

      {/* 4 Action Buttons Row with Hover Tooltips */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3.5 my-auto py-3">
        {actionButtons.map((action) => {
          const Icon = action.icon;
          const isHovered = hoveredAction === action.id;

          return (
            <div
              key={action.id}
              className="relative flex flex-col items-center group"
              onMouseEnter={() => setHoveredAction(action.id)}
              onMouseLeave={() => setHoveredAction(null)}
            >
              {/* Floating Tooltip that pops up when moving mouse over button */}
              <div
                role="tooltip"
                className={`absolute -top-11 left-1/2 -translate-x-1/2 pointer-events-none z-50 flex flex-col items-center whitespace-nowrap transition-all duration-200 drop-shadow-2xl ${
                  isHovered ? 'opacity-100 -translate-y-1 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:scale-100'
                }`}
              >
                <div
                  className="px-2.5 py-1 rounded-lg bg-[#18272C] border text-[11px] font-semibold text-[#F1F5F4] shadow-2xl flex items-center gap-1.5 backdrop-blur-md"
                  style={{ borderColor: action.accentColor }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: action.accentColor }}
                  />
                  <span className="font-bold">{action.name}</span>
                  <span className="text-[10px] text-[#A5B4B8] font-normal">
                    ({action.fullTitle})
                  </span>
                </div>
                {/* Tooltip Downward Caret Arrow */}
                <div
                  className="w-2 h-2 rotate-45 -mt-1 bg-[#18272C] border-r border-b"
                  style={{ borderColor: action.accentColor }}
                />
              </div>

              {/* Action Button Tile */}
              <button
                type="button"
                onClick={action.onClick}
                onMouseEnter={() => setHoveredAction(action.id)}
                onMouseLeave={() => setHoveredAction(null)}
                onFocus={() => setHoveredAction(action.id)}
                onBlur={() => setHoveredAction(null)}
                title={`${action.name} - ${action.fullTitle}`}
                aria-label={`${action.name} - ${action.fullTitle}`}
                className={`w-full max-w-[76px] aspect-square rounded-2xl bg-[#18272C] border transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs group-hover:scale-105 active:scale-95 ${
                  isHovered ? 'scale-105' : 'hover:border-[#35E9A0]/40'
                }`}
                style={{
                  borderColor: isHovered ? action.accentColor : '#24363B',
                  boxShadow: isHovered ? `0 0 16px ${action.accentColor}35` : undefined
                }}
              >
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${action.bgColor} border flex items-center justify-center ${action.iconColor} shadow-inner transition-transform duration-200 group-hover:scale-110 ${
                    isHovered ? 'scale-110' : ''
                  }`}
                  style={{ borderColor: `${action.accentColor}40` }}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
              </button>

              {/* Label beneath button */}
              <span
                className="text-[11px] font-medium transition-colors mt-2 text-center group-hover:text-white"
                style={{
                  color: isHovered ? action.accentColor : '#71848A'
                }}
              >
                {action.name}
              </span>
            </div>
          );
        })}
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
                className="text-[#71848A] hover:text-[#F1F5F4] p-1 cursor-pointer"
                aria-label="Close"
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
