import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User as UserIcon,
  Settings,
  LogOut,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function Navbar({
  user,
  onLogout,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  placeholder = "Search transactions, categories, or insights...",
  notificationCount = 1
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl + K for search focus
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // User initials (e.g., "Abrar Ahmad" => "AA")
  const getInitials = (name) => {
    if (!name) return 'AA';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const displayName = user?.name || 'Abrar Ahmad';
  const initials = getInitials(displayName);

  return (
    <header className="h-[70px] bg-[#0B1114] border-b border-[#24363B] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-[#0B1114]/95">
      {/* Left: Mobile Toggle & Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile menu toggle */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-[#121E22] border border-[#24363B] text-[#A5B4B8] hover:text-[#F1F5F4] hover:border-[#35E9A0]/40 transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-[#71848A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-10 pl-10 pr-16 bg-[#121E22] border border-[#24363B] rounded-xl text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] focus:ring-1 focus:ring-[#35E9A0]/30 transition"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#18272C] border border-[#24363B] text-[10px] font-medium text-[#71848A] pointer-events-none">
            <span>Ctrl</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notifications Button */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-10 h-10 rounded-full border border-[#24363B] bg-[#121E22] hover:bg-[#18272C] flex items-center justify-center text-[#A5B4B8] hover:text-[#F1F5F4] hover:border-[#35E9A0]/40 transition relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#FF667A] absolute top-2.5 right-2.5 ring-2 ring-[#0B1114]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#121E22] border border-[#24363B] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#24363B]">
                <span className="text-xs font-semibold text-[#F1F5F4]">Notifications</span>
                <span className="text-[10px] bg-[#123D32] text-[#35E9A0] px-2 py-0.5 rounded-full font-medium">
                  1 New
                </span>
              </div>
              <div className="py-2 space-y-2">
                <div className="p-2.5 rounded-lg bg-[#18272C] border border-[#24363B] hover:border-[#35E9A0]/30 transition">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#123D32] text-[#35E9A0] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#F1F5F4]">Monthly Budget Alert</p>
                      <p className="text-[11px] text-[#A5B4B8] mt-0.5 leading-snug">
                        You have maintained 32% savings rate this month! Keep it up.
                      </p>
                      <span className="text-[10px] text-[#71848A] mt-1 block">Just now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1.5 rounded-xl hover:bg-[#121E22] border border-transparent hover:border-[#24363B] transition cursor-pointer"
            aria-label="User menu"
          >
            {/* Circular Avatar */}
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover border border-[#24363B]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#15372F] border border-[#35E9A0]/30 text-[#35E9A0] font-bold text-xs flex items-center justify-center shadow-xs">
                {initials}
              </div>
            )}

            {/* User Name */}
            <span className="hidden sm:inline-block text-xs sm:text-sm font-medium text-[#F1F5F4] tracking-tight">
              {displayName}
            </span>

            {/* Dropdown Chevron */}
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#71848A] transition-transform duration-200 ${
                profileOpen ? 'rotate-180 text-[#35E9A0]' : ''
              }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#121E22] border border-[#24363B] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* User Details Header */}
              <div className="p-3 border-b border-[#24363B]">
                <p className="text-xs font-semibold text-[#F1F5F4]">{displayName}</p>
                <p className="text-[11px] text-[#71848A] truncate mt-0.5">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-[#18272C] text-[#35E9A0] px-2 py-0.5 rounded border border-[#24363B] font-medium capitalize">
                    {user?.authProvider === 'google' ? 'Google Account' : 'Verified'}
                  </span>
                  {user?.occupation && (
                    <span className="text-[10px] bg-[#18272C] text-[#A5B4B8] px-2 py-0.5 rounded border border-[#24363B] font-medium capitalize">
                      {user.occupation}
                    </span>
                  )}
                </div>
              </div>

              {/* Menu Links */}
              <div className="py-1">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C] transition text-left"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#71848A]" />
                  <span>Profile Overview</span>
                </button>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C] transition text-left"
                >
                  <Settings className="w-3.5 h-3.5 text-[#71848A]" />
                  <span>Settings & Preferences</span>
                </button>
              </div>

              {/* Sign out */}
              <div className="pt-1 border-t border-[#24363B]">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#FF667A] hover:bg-[#3D1A22]/40 transition text-left"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#FF667A]" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
