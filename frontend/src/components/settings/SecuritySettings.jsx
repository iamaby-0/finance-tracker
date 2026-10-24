import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, KeyRound, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function SecuritySettings({ user, onChangePassword }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const isGoogleOnly = user?.authProvider === 'google' && !user?.hasPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess('');

    if (!currentPassword) {
      setError('Current password is required.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      setSaving(true);
      await onChangePassword({ currentPassword, newPassword });
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to update password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password Card */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-[#24363B]">
          <div className="w-9 h-9 rounded-xl bg-[#123D32] border border-[#35E9A0]/30 text-[#35E9A0] flex items-center justify-center flex-shrink-0">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F1F5F4]">
              Change Password
            </h3>
            <p className="text-xs text-[#71848A]">
              Update your account password to maintain security.
            </p>
          </div>
        </div>

        {isGoogleOnly ? (
          <div className="mt-4 p-4 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#A5B4B8] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#35E9A0] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#F1F5F4] mb-1">
                Google Authentication Active
              </p>
              <p className="leading-relaxed">
                You signed in with your verified Google account. Password change is only applicable to email and password logins.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 max-w-lg">
            {success && (
              <div className="p-3 rounded-xl bg-[#123D32] border border-[#35E9A0]/40 text-[#35E9A0] text-xs flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-[#FF667A]/15 border border-[#FF667A]/40 text-[#FF667A] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Current Password */}
            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71848A]" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0B1114] border border-[#24363B] focus:border-[#35E9A0] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#F1F5F4] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71848A] hover:text-[#F1F5F4]"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71848A]" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0B1114] border border-[#24363B] focus:border-[#35E9A0] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#F1F5F4] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71848A] hover:text-[#F1F5F4]"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-[#71848A] mt-1">
                Must be at least 6 characters long.
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71848A]" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0B1114] border border-[#24363B] focus:border-[#35E9A0] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#F1F5F4] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71848A] hover:text-[#F1F5F4]"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Password</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Active Session & Security Overview */}
      <div className="bg-[#121E22] border border-[#24363B] rounded-2xl p-6 shadow-sm">
        <h4 className="text-sm font-bold text-[#F1F5F4] mb-3">
          Session & Protection Overview
        </h4>
        <div className="space-y-3 text-xs text-[#A5B4B8]">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B1114] border border-[#24363B]">
            <div>
              <span className="font-semibold text-[#F1F5F4] block">Current Browser Session</span>
              <span className="text-[11px] text-[#71848A]">Authenticated via JWT token</span>
            </div>
            <span className="text-[11px] text-[#35E9A0] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Active
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B1114] border border-[#24363B]">
            <div>
              <span className="font-semibold text-[#F1F5F4] block">Two-Factor Authentication (2FA)</span>
              <span className="text-[11px] text-[#71848A]">Currently supported through Google Account Security</span>
            </div>
            <span className="text-[11px] text-[#A5B4B8] font-medium">
              Google Protected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
