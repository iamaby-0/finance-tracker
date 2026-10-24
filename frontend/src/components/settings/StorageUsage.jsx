import React from 'react';

export default function StorageUsage({ storage }) {
  const usedMb = storage?.usedMb ?? 3.2;
  const totalMb = storage?.totalMb ?? 10;
  const percentage = storage?.percentage ?? 32;

  const breakdown = storage?.breakdown || {
    transactionsMb: 1.8,
    reportsMb: 0.9,
    othersMb: 0.5
  };

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-2xl p-5 shadow-sm">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
        <div>
          <h3 className="text-sm font-bold text-[#F1F5F4] tracking-tight">
            Storage & Usage
          </h3>
          <p className="text-xs text-[#71848A] mt-0.5">
            Track your data usage and storage.
          </p>
        </div>
      </div>

      {/* Progress Bar & Percentage */}
      <div className="flex items-center gap-4 my-2">
        <div className="flex-1 h-2.5 bg-[#18272C] rounded-full overflow-hidden border border-[#24363B]">
          <div
            className="h-full bg-[#35E9A0] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(53,233,160,0.5)]"
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>
        <span className="text-xs font-bold text-[#F1F5F4] min-w-[36px] text-right">
          {percentage}%
        </span>
      </div>

      {/* Legend & Usage breakdown */}
      <div className="flex flex-wrap items-center justify-between gap-y-2 pt-2 text-xs">
        <div className="text-xs font-semibold text-[#F1F5F4]">
          {usedMb} MB <span className="font-normal text-[#A5B4B8]">of {totalMb} MB used</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#A5B4B8]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#35E9A0]" />
            <span>Transactions ({breakdown.transactionsMb} MB)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#45B7F5]" />
            <span>Reports ({breakdown.reportsMb} MB)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B18AFF]" />
            <span>Others ({breakdown.othersMb} MB)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
