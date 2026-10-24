import React, { useState } from 'react';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ConnectedAccounts({ user, connectedAccounts }) {
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showManageEmailModal, setShowManageEmailModal] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const googleConnected = connectedAccounts?.google?.connected ?? true;
  const canDisconnect = connectedAccounts?.google?.canDisconnect ?? false;
  const emailConnected = connectedAccounts?.email?.connected ?? true;
  const userEmail = user?.email || connectedAccounts?.email?.email || 'abrarahmad@example.com';

  const handleDisconnectGoogle = () => {
    if (!canDisconnect) {
      setFeedback({
        type: 'warning',
        message: 'Google is your primary authentication provider. Disconnecting Google is disabled to prevent accidental account lockout.'
      });
      setShowDisconnectModal(false);
      setTimeout(() => setFeedback(null), 5000);
      return;
    }

    setFeedback({
      type: 'info',
      message: 'Provider disconnection request received.'
    });
    setShowDisconnectModal(false);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[#F1F5F4] tracking-tight">
          Connected Accounts
        </h3>
        <p className="text-xs text-[#71848A] mt-0.5">
          Link your accounts for better insights.
        </p>
      </div>

      {feedback && (
        <div
          className={`mb-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === 'warning'
              ? 'bg-[#F6C85F]/10 border border-[#F6C85F]/30 text-[#F6C85F]'
              : 'bg-[#123D32] border border-[#35E9A0]/30 text-[#35E9A0]'
          }`}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Google Card */}
        <div className="bg-[#0B1114] border border-[#24363B] rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Google Logo */}
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center p-1.5 shadow-sm flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#F1F5F4]">Google</div>
              <div className="text-[11px] text-[#35E9A0] font-medium flex items-center gap-1">
                Connected
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowDisconnectModal(true)}
            className="px-3 py-1.5 rounded-lg border border-[#FF667A]/30 text-[#FF667A] hover:bg-[#FF667A]/10 text-xs font-medium transition cursor-pointer"
          >
            Disconnect
          </button>
        </div>

        {/* Email Card */}
        <div className="bg-[#0B1114] border border-[#24363B] rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#18272C] border border-[#20D6C7]/30 flex items-center justify-center text-[#20D6C7] flex-shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#F1F5F4]">Email</div>
              <div className="text-[11px] text-[#35E9A0] font-medium flex items-center gap-1">
                Connected
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowManageEmailModal(true)}
            className="px-3 py-1.5 rounded-lg border border-[#24363B] text-[#F1F5F4] hover:bg-[#203238] text-xs font-medium transition cursor-pointer"
          >
            Manage
          </button>
        </div>
      </div>

      {/* Disconnect Google Modal */}
      {showDisconnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-[#121E22] border border-[#24363B] rounded-2xl p-5 sm:p-6 max-w-md w-[92%] sm:w-full shadow-2xl">
            <h4 className="text-sm font-bold text-[#F1F5F4] mb-2">
              Disconnect Google Account
            </h4>
            <p className="text-xs text-[#A5B4B8] mb-4 leading-relaxed">
              {!canDisconnect
                ? 'Your Google account is currently the primary authentication method for My Finance Track. You cannot disconnect it without having another verified login credential.'
                : 'Are you sure you want to unlink your Google account? You will need to use your email and password to log in in the future.'}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDisconnectModal(false)}
                className="px-3 py-1.5 rounded-lg border border-[#24363B] text-[#A5B4B8] hover:text-[#F1F5F4] text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDisconnectGoogle}
                className="px-3.5 py-1.5 rounded-lg bg-[#FF667A] hover:bg-[#FF4D66] text-[#0B1114] text-xs font-bold transition cursor-pointer"
              >
                {!canDisconnect ? 'Understood' : 'Confirm Disconnect'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Email Modal */}
      {showManageEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-[#121E22] border border-[#24363B] rounded-2xl p-5 sm:p-6 max-w-md w-[92%] sm:w-full shadow-2xl">
            <h4 className="text-sm font-bold text-[#F1F5F4] mb-2">
              Account Email
            </h4>
            <p className="text-xs text-[#A5B4B8] mb-3 leading-relaxed">
              Your registered account email address is:
            </p>
            <div className="p-3 rounded-xl bg-[#0B1114] border border-[#24363B] text-xs text-[#F1F5F4] font-mono mb-4 flex items-center justify-between">
              <span>{userEmail}</span>
              <span className="text-[10px] text-[#35E9A0] font-sans font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            </div>
            <p className="text-[11px] text-[#71848A] mb-4">
              To change your primary email address or security contact, please use our secure re-authentication procedure.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowManageEmailModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
