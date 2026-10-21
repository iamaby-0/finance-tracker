import React, { useState } from 'react';
import { Database, Download, ShieldCheck, Check, Loader2, FileJson, AlertCircle } from 'lucide-react';
import { exportUserData } from '../../services/userService';

export default function DataPrivacySettings({ storage }) {
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    try {
      setExporting(true);
      setError(null);
      setExportSuccess(false);

      const res = await exportUserData();
      const dataToExport = res?.data || res;

      // Trigger browser download of JSON file
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `my-finance-track-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 5000);
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export your data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Card */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-[#24363B]">
          <div className="w-9 h-9 rounded-xl bg-[#123D32] border border-[#35E9A0]/30 text-[#35E9A0] flex items-center justify-center flex-shrink-0">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F1F5F4]">
              Export Your Financial Data
            </h3>
            <p className="text-xs text-[#71848A]">
              Download an offline JSON archive of all your incomes, expenses, budgets, goals, and categories.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <p className="text-xs text-[#A5B4B8] leading-relaxed">
            You have full ownership of your financial records. Exporting generates a portable JSON file containing your complete ledger history, category mappings, and budget benchmarks.
          </p>

          {exportSuccess && (
            <div className="p-3 rounded-xl bg-[#123D32] border border-[#35E9A0]/40 text-[#35E9A0] text-xs flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>Export downloaded successfully to your computer!</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-[#FF667A]/15 border border-[#FF667A]/40 text-[#FF667A] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            disabled={exporting}
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Exporting Records...</span>
              </>
            ) : (
              <>
                <FileJson className="w-4 h-4" />
                <span>Export My Data (.JSON)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Privacy Guarantees */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-2xl p-6 shadow-sm">
        <h4 className="text-sm font-bold text-[#F1F5F4] mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#35E9A0]" />
          <span>Privacy & Data Sovereignty</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#0B1114] border border-[#24363B]">
            <span className="font-semibold text-[#F1F5F4] block mb-1">
              Zero Ad Tracking
            </span>
            <p className="text-[11px] text-[#71848A] leading-relaxed">
              We never sell or broker your transaction data to advertisers or third-party data brokers.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B1114] border border-[#24363B]">
            <span className="font-semibold text-[#F1F5F4] block mb-1">
              Encrypted Storage
            </span>
            <p className="text-[11px] text-[#71848A] leading-relaxed">
              Your credentials and sensitive session tokens are salted, hashed, and guarded with industry standards.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B1114] border border-[#24363B]">
            <span className="font-semibold text-[#F1F5F4] block mb-1">
              User-Initiated Purge
            </span>
            <p className="text-[11px] text-[#71848A] leading-relaxed">
              Account deletion completely and permanently wipes all database entries associated with your user ID.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
