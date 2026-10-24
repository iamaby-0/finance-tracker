import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import SettingsTabs from '../components/settings/SettingsTabs';
import ProfileInformation from '../components/settings/ProfileInformation';
import PreferencesCard from '../components/settings/PreferencesCard';
import NotificationSettings from '../components/settings/NotificationSettings';
import StorageUsage from '../components/settings/StorageUsage';
import ConnectedAccounts from '../components/settings/ConnectedAccounts';
import DangerZone from '../components/settings/DangerZone';
import SecuritySettings from '../components/settings/SecuritySettings';
import DataPrivacySettings from '../components/settings/DataPrivacySettings';
import AboutSettings from '../components/settings/AboutSettings';
import {
  getUserProfile,
  updateProfile,
  updatePreferences,
  updateNotifications,
  changePassword,
  getStorageUsage,
  deleteAccount
} from '../services/userService';
import { Settings as SettingsIcon, Loader2 } from 'lucide-react';

export function Settings() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const [profile, setProfile] = useState(null);
  const [storage, setStorage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial profile & storage
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileRes, storageRes] = await Promise.allSettled([
        getUserProfile(),
        getStorageUsage()
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
        setProfile(profileRes.value.data);
      } else {
        // Fallback default populated with user data from auth
        setProfile({
          name: user?.name || 'Abrar Ahmad',
          email: user?.email || 'abrarahmad@example.com',
          phoneNumber: user?.phoneNumber || '+91 98765 43210',
          dateOfBirth: '2001-10-10',
          country: 'India',
          city: 'Greater Noida',
          about: 'Managing my finances to build a better future.',
          preferences: {
            currency: 'INR',
            dateFormat: 'DD/MM/YYYY',
            firstDayOfWeek: 'Monday',
            language: 'English',
            theme: 'dark'
          },
          notifications: {
            expenseAlerts: true,
            savingsMilestones: true,
            weeklySummary: false,
            budgetReminders: true,
            goalUpdates: true,
            productUpdates: false
          },
          connectedAccounts: {
            google: { connected: true, canDisconnect: false },
            email: { connected: true, email: user?.email || 'abrarahmad@example.com' }
          }
        });
      }

      if (storageRes.status === 'fulfilled' && storageRes.value?.data) {
        setStorage(storageRes.value.data);
      } else {
        setStorage({
          usedMb: 3.2,
          totalMb: 10,
          percentage: 32,
          breakdown: {
            transactionsMb: 1.8,
            reportsMb: 0.9,
            othersMb: 0.5
          }
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Update profile
  const handleUpdateProfile = async (data) => {
    const res = await updateProfile(data);
    const updated = res?.data || res;
    setProfile((prev) => ({
      ...prev,
      ...updated
    }));
    if (updateUser) {
      updateUser(updated);
    }
    return res;
  };

  // Update preferences
  const handleUpdatePreferences = async (data) => {
    const res = await updatePreferences(data);
    const updated = res?.data || res;
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev?.preferences,
        ...updated
      }
    }));
    return res;
  };

  // Update notification settings
  const handleUpdateNotifications = async (data) => {
    const res = await updateNotifications(data);
    const updated = res?.data || res;
    setProfile((prev) => ({
      ...prev,
      notifications: {
        ...prev?.notifications,
        ...updated
      }
    }));
    return res;
  };

  // Change password
  const handleChangePassword = async (data) => {
    const res = await changePassword(data);
    return res;
  };

  // Delete account
  const handleDeleteAccount = async (confirmation) => {
    await deleteAccount(confirmation);
    logout();
    navigate('/login');
  };

  const mainRef = React.useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  return (
    <div className="flex h-screen bg-[#0B1114] text-[#F1F5F4] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeItem="Settings"
        user={user || profile}
        onLogout={logout}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Navbar */}
        <Navbar
          user={user || profile}
          onLogout={logout}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          placeholder="Search settings, profile, preferences..."
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable Page Body */}
        <main ref={mainRef} className="flex-1 px-3 sm:px-5 md:px-6 py-3.5 sm:py-4.5">
          <div className="max-w-[1400px] mx-auto space-y-3.5 sm:space-y-4">
            {/* Header: Settings Title + Cog Icon + Subtitle */}
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-[#F1F5F4] tracking-tight">
                  Settings
                </h1>
                <div className="w-6 h-6 rounded-lg bg-[#123D32] border border-[#35E9A0]/40 flex items-center justify-center text-[#35E9A0] shadow-[0_0_12px_rgba(53,233,160,0.25)]">
                  <SettingsIcon className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-[11px] text-[#71848A] font-normal">
                Manage your account, preferences and app settings.
              </p>
            </div>

            {/* Horizontal Tabs Row */}
            <SettingsTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab View Content */}
            {loading && !profile ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-[#35E9A0] animate-spin" />
                <span className="text-xs text-[#71848A]">Loading settings...</span>
              </div>
            ) : activeTab === 'profile' ? (
              /* Profile tab: Default view matching reference screenshot */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Left Column (Profile Information, Storage & Usage, Connected Accounts) */}
                <div className="lg:col-span-7 space-y-4">
                  <ProfileInformation
                    profile={profile}
                    onUpdateProfile={handleUpdateProfile}
                    loading={loading}
                  />

                  <StorageUsage storage={storage} />

                  <ConnectedAccounts
                    user={user || profile}
                    connectedAccounts={profile?.connectedAccounts}
                  />
                </div>

                {/* Right Column (Preferences, Notification Settings, Danger Zone) */}
                <div className="lg:col-span-5 space-y-4">
                  <PreferencesCard
                    preferences={profile?.preferences}
                    onUpdatePreferences={handleUpdatePreferences}
                  />

                  <NotificationSettings
                    notifications={profile?.notifications}
                    onUpdateNotifications={handleUpdateNotifications}
                  />

                  <DangerZone
                    onDeleteAccount={handleDeleteAccount}
                  />
                </div>
              </div>
            ) : activeTab === 'security' ? (
              <div className="max-w-3xl">
                <SecuritySettings
                  user={profile || user}
                  onChangePassword={handleChangePassword}
                />
              </div>
            ) : activeTab === 'data-privacy' ? (
              <div className="max-w-3xl">
                <DataPrivacySettings storage={storage} />
              </div>
            ) : activeTab === 'about' ? (
              <div className="max-w-3xl">
                <AboutSettings />
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;
