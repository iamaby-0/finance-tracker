import React from 'react';
import { Info, Shield, FileText, Heart, ExternalLink } from 'lucide-react';

export default function AboutSettings() {
  return (
    <div className="space-y-6">
      {/* App Info Card */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4 pb-5 border-b border-[#24363B]">
          <div className="w-12 h-12 rounded-xl bg-[#123D32] border border-[#35E9A0]/30 flex items-center justify-center p-2 shadow-sm flex-shrink-0">
            <div className="flex items-end gap-1 h-5 w-5">
              <span className="w-1 h-2.5 bg-[#35E9A0] rounded-xs animate-pulse"></span>
              <span className="w-1 h-4.5 bg-[#4FFFB0] rounded-xs"></span>
              <span className="w-1 h-3.5 bg-[#35E9A0] rounded-xs"></span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#F1F5F4] tracking-tight">
                My Finance <span className="text-[#35E9A0]">Track</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#18272C] border border-[#24363B] text-[10px] font-mono text-[#35E9A0]">
                v1.0.0
              </span>
            </div>
            <p className="text-xs text-[#A5B4B8] mt-1 font-medium">
              Track Your Money. Free Your Mind.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4 text-xs text-[#A5B4B8] leading-relaxed">
          <p>
            My Finance Track is an intelligent personal finance platform designed to give you clarity, control, and peace of mind over your finances. Analyze daily cashflows, project budget limits, reach savings goals, and harness AI-driven insights to make confident financial decisions.
          </p>

          <div className="p-4 rounded-xl bg-[#0B1114] border border-[#24363B] space-y-2">
            <div className="text-xs font-semibold text-[#F1F5F4]">
              Technology & Architecture
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[#71848A]">
              <div>Frontend: <span className="text-[#F1F5F4]">React 18 + Vite</span></div>
              <div>Styling: <span className="text-[#F1F5F4]">Tailwind CSS v4</span></div>
              <div>Backend: <span className="text-[#F1F5F4]">Node.js Express</span></div>
              <div>Database: <span className="text-[#F1F5F4]">MongoDB</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal & Policy Links */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-2xl p-6 shadow-sm">
        <h4 className="text-sm font-bold text-[#F1F5F4] mb-3">
          Legal & Privacy
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#0B1114] border border-[#24363B] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#35E9A0]" />
              <span className="font-medium text-[#F1F5F4]">Privacy Policy</span>
            </div>
            <span className="text-[11px] text-[#71848A]">Active</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B1114] border border-[#24363B] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-[#45B7F5]" />
              <span className="font-medium text-[#F1F5F4]">Terms of Service</span>
            </div>
            <span className="text-[11px] text-[#71848A]">Active</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#24363B]/60 flex items-center justify-between text-[11px] text-[#71848A]">
          <span>© {new Date().getFullYear()} My Finance Track. All rights reserved.</span>
          <span className="flex items-center gap-1 text-[#35E9A0]">
            Built with care for your financial freedom
          </span>
        </div>
      </div>
    </div>
  );
}
