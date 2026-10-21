import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Sparkles,
  FileText,
  Tags,
  Target,
  Settings,
  LogOut,
  Crown,
  ArrowUpRight,
  LayoutGrid,
  X
} from 'lucide-react';

export default function Sidebar({
  activeItem = 'Dashboard',
  user,
  onNavigate,
  onLogout,
  isOpen = false,
  onClose
}) {
  const navigate = useNavigate();

  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'Transactions', label: 'Transactions', icon: ArrowLeftRight, path: '/transactions' },
    { id: 'Income', label: 'Income', icon: TrendingUp, path: '/income' },
    { id: 'Expenses', label: 'Expenses', icon: TrendingDown, path: '/expenses' },
    { id: 'Budgets', label: 'Budgets', icon: PieChart, path: '/budgets' },
    { id: 'Analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { id: 'AI Insights', label: 'AI Insights', icon: Sparkles, path: '/ai-insights' },
    { id: 'Reports', label: 'Reports', icon: FileText, path: '/reports' },
    { id: 'Categories', label: 'Categories', icon: LayoutGrid, path: '/categories' },
    { id: 'Goals', label: 'Goals', icon: Target, path: '/goals' },
  ];

  const handleItemClick = (item) => {
    if (onNavigate) {
      onNavigate(item);
    }
    if (item.path) {
      navigate(item.path);
    }
    if (onClose) {
      onClose();
    }
  };

  const getInitials = (name) => {
    if (!name) return 'AA';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const displayName = user?.name || 'Abrar Ahmad';
  const initials = getInitials(displayName);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#101A1D] border-r border-[#24363B] w-[266px] flex-shrink-0 select-none">
      {/* Logo & Tagline */}
      <div className="pt-6 pb-5 px-6 border-b border-[#24363B]/50 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            {/* Mint Green Financial Bar-Chart Icon */}
            <div className="w-8 h-8 rounded-lg bg-[#123D32] border border-[#35E9A0]/30 flex items-center justify-center p-1.5 shadow-sm">
              <div className="flex items-end gap-1 h-4 w-4">
                <span className="w-1 h-2 bg-[#35E9A0] rounded-xs animate-pulse"></span>
                <span className="w-1 h-3.5 bg-[#4FFFB0] rounded-xs"></span>
                <span className="w-1 h-2.5 bg-[#35E9A0] rounded-xs"></span>
              </div>
            </div>
            <div>
              <span className="text-base font-bold text-[#F1F5F4] tracking-tight">
                My Finance <span className="text-[#35E9A0]">Track</span>
              </span>
            </div>
          </div>
          <p className="text-[11px] text-[#71848A] mt-1 tracking-tight font-normal">
            Track Your Money. Free Your Mind.
          </p>
        </div>

        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C] transition"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Menu Label */}
      <div className="px-5 pt-3 pb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#71848A]">
          MAIN MENU
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group text-left cursor-pointer ${
                isActive
                  ? 'bg-[#15372F] text-[#35E9A0] border-l-4 border-[#35E9A0] shadow-sm font-semibold'
                  : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C]'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-[#35E9A0]' : 'text-[#71848A] group-hover:text-[#A5B4B8]'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Thin Divider */}
        <div className="pt-2 pb-1 px-2">
          <div className="h-px bg-[#24363B]" />
        </div>

        {/* Settings */}
        <button
          onClick={() => handleItemClick({ id: 'Settings', label: 'Settings', path: '/settings' })}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group text-left cursor-pointer ${
            activeItem === 'Settings'
              ? 'bg-[#15372F] text-[#F1F5F4] border border-[#35E9A0]/50 shadow-[0_0_15px_rgba(53,233,160,0.15)] font-semibold'
              : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C]'
          }`}
        >
          <Settings className={`w-4 h-4 transition-colors ${activeItem === 'Settings' ? 'text-[#35E9A0]' : 'text-[#71848A] group-hover:text-[#A5B4B8]'}`} />
          <span>Settings</span>
        </button>

        {/* Logout */}
        <button
          onClick={() => {
            if (onLogout) onLogout();
            if (onClose) onClose();
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group text-left cursor-pointer text-[#A5B4B8] hover:text-[#FF667A] hover:bg-[#18272C]"
        >
          <LogOut className="w-4 h-4 text-[#71848A] group-hover:text-[#FF667A] transition-colors" />
          <span>Logout</span>
        </button>
      </nav>

      {/* Promotional Card at bottom (consistent across all pages) */}
      <div className="p-4 pt-2">
        <div className="relative rounded-2xl bg-[#121E22] border border-[#24363B] p-4 overflow-hidden shadow-lg group hover:border-[#35E9A0]/40 transition duration-300">
          {/* Subtle Glow Backdrop */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#35E9A0]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Crown Icon */}
          <div className="flex items-center justify-between mb-2">
            <div className="w-6 h-6 rounded-md bg-[#252317] border border-[#F6C85F]/30 flex items-center justify-center text-[#F6C85F]">
              <Crown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card Text */}
          <h4 className="text-sm font-bold text-[#F1F5F4] leading-tight">
            {activeItem === 'Settings'
              ? 'Unlock More Financial Insights'
              : activeItem === 'Goals'
              ? 'Achieve Your Financial Goals'
              : activeItem === 'AI Insights'
              ? 'Unlock the Power of AI Insights'
              : activeItem === 'Budgets'
              ? 'Stay on Budget'
              : activeItem === 'Expenses'
              ? 'Control Your Spending Better'
              : activeItem === 'Analytics'
              ? 'Unlock Deeper Financial Insights'
              : activeItem === 'Reports'
              ? 'Generate Detailed Financial Reports'
              : activeItem === 'Categories'
              ? 'Organize Your Finances Better'
              : 'Track Smarter'}
            <span className="block font-semibold text-[#A5B4B8] text-xs">
              {activeItem === 'Settings'
                ? ''
                : activeItem === 'Goals'
                ? ''
                : activeItem === 'AI Insights'
                ? ''
                : activeItem === 'Budgets'
                ? 'Build Your Future'
                : activeItem === 'Expenses'
                ? ''
                : activeItem === 'Analytics'
                ? ''
                : activeItem === 'Reports'
                ? ''
                : activeItem === 'Categories'
                ? ''
                : 'Live Better'}
            </span>
          </h4>
          <p className="text-[11px] text-[#71848A] mt-1.5 leading-snug">
            {activeItem === 'Settings'
              ? 'Get AI-powered insights, advanced analytics and more features.'
              : activeItem === 'Goals'
              ? 'Set goals, track progress and get AI powered recommendations to reach them faster.'
              : activeItem === 'AI Insights'
              ? 'Get personalized recommendations, smarter analysis and achieve your financial goals faster.'
              : activeItem === 'Budgets'
              ? 'Create smart budgets and achieve your goals.'
              : activeItem === 'Expenses'
              ? 'Track expenses, find insights and save more.'
              : activeItem === 'Analytics'
              ? 'Get detailed analytics and personalized reports.'
              : activeItem === 'Reports'
              ? 'Analyze your spending, income and savings with beautiful reports.'
              : activeItem === 'Categories'
              ? 'Create and manage custom categories for better tracking.'
              : 'Get AI insights and better financial control.'}
          </p>

          {/* Decorative Mini Trend Chart & Arrow Button */}
          <div className="mt-3 pt-2 border-t border-[#24363B]/50 flex items-center justify-between">
            {/* Mini SVG Trend Line */}
            <div className="w-20 h-6">
              <svg viewBox="0 0 80 24" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="promoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#35E9A0" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#35E9A0" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,20 Q20,18 35,12 T65,6 T80,2 L80,24 L0,24 Z"
                  fill="url(#promoGrad)"
                />
                <path
                  d="M0,20 Q20,18 35,12 T65,6 T80,2"
                  fill="none"
                  stroke="#35E9A0"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
                <circle cx="80" cy="2" r="2.5" fill="#4FFFB0" />
              </svg>
            </div>

            {/* Circular Arrow Button */}
            <button
              onClick={() => handleItemClick({ id: 'AI Insights', label: 'AI Insights' })}
              className="w-7 h-7 rounded-full bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Explore AI Insights"
            >
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block h-screen sticky top-0 z-30 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Collapsible) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Slide-out Sidebar Panel */}
          <div className="relative z-10 h-full w-[266px] shadow-2xl animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
