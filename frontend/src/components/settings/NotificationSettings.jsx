import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Award,
  BarChart2,
  Clock,
  Target,
  Megaphone,
  Check,
  Loader2
} from 'lucide-react';

const NOTIFICATION_ITEMS = [
  {
    id: 'expenseAlerts',
    label: 'Expense Alerts',
    description: 'Get notified when you exceed budget limits',
    icon: AlertTriangle,
    iconBg: 'bg-[#FF667A]/15 text-[#FF667A]',
    defaultChecked: true
  },
  {
    id: 'savingsMilestones',
    label: 'Savings Milestones',
    description: 'Notifications for goal progress and milestones',
    icon: Award,
    iconBg: 'bg-[#35E9A0]/15 text-[#35E9A0]',
    defaultChecked: true
  },
  {
    id: 'weeklySummary',
    label: 'Weekly Summary',
    description: 'Get a weekly summary of your finances',
    icon: BarChart2,
    iconBg: 'bg-[#45B7F5]/15 text-[#45B7F5]',
    defaultChecked: false
  },
  {
    id: 'budgetReminders',
    label: 'Budget Reminders',
    description: 'Reminders about budget renewals',
    icon: Clock,
    iconBg: 'bg-[#F6C85F]/15 text-[#F6C85F]',
    defaultChecked: true
  },
  {
    id: 'goalUpdates',
    label: 'Goal Updates',
    description: 'Updates on your financial goals',
    icon: Target,
    iconBg: 'bg-[#B18AFF]/15 text-[#B18AFF]',
    defaultChecked: true
  },
  {
    id: 'productUpdates',
    label: 'Product Updates',
    description: 'New features and announcements',
    icon: Megaphone,
    iconBg: 'bg-[#20D6C7]/15 text-[#20D6C7]',
    defaultChecked: false
  }
];

export default function NotificationSettings({ notifications, onUpdateNotifications }) {
  const [settings, setSettings] = useState({
    expenseAlerts: true,
    savingsMilestones: true,
    weeklySummary: false,
    budgetReminders: true,
    goalUpdates: true,
    productUpdates: false
  });
  const [updatingKey, setUpdatingKey] = useState(null);

  useEffect(() => {
    if (notifications) {
      setSettings((prev) => ({
        ...prev,
        ...notifications
      }));
    }
  }, [notifications]);

  const handleToggle = async (key) => {
    const newValue = !settings[key];
    const prevValue = settings[key];

    // Optimistic update
    setSettings((prev) => ({
      ...prev,
      [key]: newValue
    }));

    try {
      setUpdatingKey(key);
      await onUpdateNotifications({ [key]: newValue });
    } catch (err) {
      console.error('Failed to update notification setting:', err);
      // Revert on error
      setSettings((prev) => ({
        ...prev,
        [key]: prevValue
      }));
    } finally {
      setUpdatingKey(null);
    }
  };

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-2xl p-5 shadow-sm">
      {/* Title */}
      <div className="mb-3">
        <h3 className="text-sm font-bold text-[#F1F5F4] tracking-tight">
          Notification Settings
        </h3>
        <p className="text-[11px] text-[#71848A] mt-0.5">
          Choose what notifications you want to receive.
        </p>
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {NOTIFICATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const isChecked = !!settings[item.id];
          const isUpdating = updatingKey === item.id;

          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 p-1.5 rounded-xl transition hover:bg-[#18272C]/40"
            >
              {/* Left icon & text */}
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-[#F1F5F4] truncate">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-[#71848A] line-clamp-2 leading-tight">
                    {item.description}
                  </div>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isChecked}
                aria-label={`Toggle ${item.label}`}
                disabled={isUpdating}
                onClick={() => handleToggle(item.id)}
                className={`relative inline-flex h-5 w-9 shrink-0 ml-2 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-[#35E9A0] ${
                  isChecked ? 'bg-[#35E9A0]' : 'bg-[#24363B]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isChecked ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
