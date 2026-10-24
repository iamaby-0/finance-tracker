import React from 'react';
import {
  User,
  ShieldCheck,
  Database,
  Info
} from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'data-privacy', label: 'Data & Privacy', icon: Database },
  { id: 'about', label: 'About', icon: Info }
];

export default function SettingsTabs({ activeTab = 'profile', onTabChange }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-[#35E9A0] text-[#0B1114] shadow-md shadow-[#35E9A0]/20'
                : 'bg-[#121E22] text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C] border border-[#24363B]'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0B1114]' : 'text-[#71848A]'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
