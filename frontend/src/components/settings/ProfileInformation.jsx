import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Globe,
  MapPin,
  FileText,
  Camera,
  Edit3,
  Check,
  X,
  Loader2,
  Upload,
  Trash2,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';

const PRESET_AVATARS = [
  {
    id: 'mint',
    label: 'Mint Tech',
    url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Abrar&backgroundColor=123d32'
  },
  {
    id: 'cyber',
    label: 'Cyber Slate',
    url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Drago&backgroundColor=18272c'
  },
  {
    id: 'purple',
    label: 'AI Purple',
    url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Fintech&backgroundColor=2b1d45'
  },
  {
    id: 'amber',
    label: 'Solar Amber',
    url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Crypto&backgroundColor=382f18'
  },
  {
    id: 'emerald',
    label: 'Emerald Flow',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=15372f'
  },
  {
    id: 'cyan',
    label: 'Frost Cyan',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria&backgroundColor=163248'
  }
];

export default function ProfileInformation({
  profile,
  onUpdateProfile,
  loading = false
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Avatar modal states
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [savingAvatar, setSavingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    country: 'India',
    city: '',
    about: '',
    profilePicture: ''
  });

  // Populate formData from profile
  useEffect(() => {
    if (profile) {
      let dobFormatted = '2001-10-10';
      if (profile.dateOfBirth) {
        try {
          const d = new Date(profile.dateOfBirth);
          dobFormatted = d.toISOString().split('T')[0];
        } catch {
          dobFormatted = '2001-10-10';
        }
      }

      setFormData({
        name: profile.name || 'Abrar Ahmad',
        email: profile.email || 'abrarahmad@example.com',
        phoneNumber: profile.phoneNumber || '+91 98765 43210',
        dateOfBirth: dobFormatted,
        country: profile.country || 'India',
        city: profile.city || 'Greater Noida',
        about: profile.about || 'Managing my finances to build a better future.',
        profilePicture: profile.profilePicture || ''
      });
      setPreviewAvatar(profile.profilePicture || '');
    }
  }, [profile]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(null);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setSuccessMsg('');
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    // Reset to current profile
    if (profile) {
      let dobFormatted = '2001-10-10';
      if (profile.dateOfBirth) {
        try {
          dobFormatted = new Date(profile.dateOfBirth).toISOString().split('T')[0];
        } catch {
          dobFormatted = '2001-10-10';
        }
      }
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
        dateOfBirth: dobFormatted,
        country: profile.country || 'India',
        city: profile.city || '',
        about: profile.about || ''
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Full Name is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await onUpdateProfile({
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        dateOfBirth: formData.dateOfBirth,
        country: formData.country,
        city: formData.city.trim(),
        about: formData.about.trim()
      });

      setIsEditing(false);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAvatarModal = () => {
    setPreviewAvatar(formData.profilePicture || '');
    setShowAvatarModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // High quality square resize to 300x300 for optimal fast storage
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 300, 300);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setPreviewAvatar(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = async () => {
    try {
      setSavingAvatar(true);
      setError(null);
      await onUpdateProfile({
        name: formData.name,
        profilePicture: previewAvatar
      });
      setFormData((prev) => ({
        ...prev,
        profilePicture: previewAvatar
      }));
      setShowAvatarModal(false);
      setSuccessMsg('Profile picture updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Save avatar error:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to update profile picture');
    } finally {
      setSavingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    setPreviewAvatar('');
  };

  const getInitials = (name) => {
    if (!name) return 'AA';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '10 Oct 2001';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-2xl p-5 shadow-sm">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#24363B]/60">
        <h3 className="text-sm font-bold text-[#F1F5F4] tracking-tight">
          Profile Information
        </h3>

        {!isEditing ? (
          <button
            onClick={handleStartEdit}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#35E9A0]/40 text-[#35E9A0] hover:bg-[#35E9A0]/10 text-xs font-semibold transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#24363B] text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C] text-xs font-medium transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#35E9A0] text-[#0B1114] hover:bg-[#4FFFB0] text-xs font-semibold shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="mt-3 p-2.5 rounded-xl bg-[#123D32] border border-[#35E9A0]/30 text-[#35E9A0] text-xs flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="mt-3 p-2.5 rounded-xl bg-[#FF667A]/10 border border-[#FF667A]/30 text-[#FF667A] text-xs flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Avatar & User Header */}
      <div className="flex items-center gap-3.5 py-3.5">
        <div className="relative group">
          <div
            onClick={handleOpenAvatarModal}
            className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#35E9A0]/40 flex items-center justify-center text-lg font-bold text-[#35E9A0] shadow-md select-none cursor-pointer hover:border-[#35E9A0] transition relative"
            title="Click to change profile picture"
          >
            {formData.profilePicture ? (
              <img
                src={formData.profilePicture}
                alt={formData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#123D32] to-[#15372F] flex items-center justify-center">
                {getInitials(formData.name)}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Camera className="w-4 h-4 text-[#35E9A0]" />
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenAvatarModal}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#18272C] border border-[#24363B] text-[#A5B4B8] hover:text-[#35E9A0] hover:border-[#35E9A0]/50 flex items-center justify-center shadow-xs cursor-pointer transition"
            title="Change profile picture"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div>
          <h2 className="text-base font-bold text-[#F1F5F4] tracking-tight">
            {formData.name || 'User'}
          </h2>
          <p className="text-[11px] text-[#71848A] mt-0.5 font-normal">
            {formData.email}
          </p>
        </div>
      </div>

      {/* Profile Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71848A]" />
            <input
              type="text"
              disabled={!isEditing}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full bg-[#0B1114] border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F1F5F4] transition-all outline-none ${
                isEditing
                  ? 'border-[#35E9A0]/50 focus:border-[#35E9A0] focus:ring-1 focus:ring-[#35E9A0]/30'
                  : 'border-[#24363B] opacity-90 cursor-default'
              }`}
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71848A]" />
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full bg-[#0B1114] border border-[#24363B] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#71848A] cursor-not-allowed select-none outline-none"
              title="Email address is linked to your authentication account and cannot be modified directly"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71848A]" />
            <input
              type="text"
              disabled={!isEditing}
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              placeholder="+91 98765 43210"
              className={`w-full bg-[#0B1114] border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F1F5F4] transition-all outline-none ${
                isEditing
                  ? 'border-[#35E9A0]/50 focus:border-[#35E9A0] focus:ring-1 focus:ring-[#35E9A0]/30'
                  : 'border-[#24363B] opacity-90 cursor-default'
              }`}
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
            Date of Birth
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71848A]" />
            {isEditing ? (
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                className="w-full bg-[#0B1114] border border-[#35E9A0]/50 focus:border-[#35E9A0] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F1F5F4] outline-none"
              />
            ) : (
              <input
                type="text"
                disabled
                value={formatDateDisplay(formData.dateOfBirth)}
                className="w-full bg-[#0B1114] border border-[#24363B] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F1F5F4] opacity-90 cursor-default outline-none"
              />
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
            Country
          </label>
          <div className="relative">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71848A]" />
            {isEditing ? (
              <select
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full bg-[#0B1114] border border-[#35E9A0]/50 rounded-xl pl-10 pr-8 py-2.5 text-xs text-[#F1F5F4] outline-none cursor-pointer"
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Singapore">Singapore</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
              </select>
            ) : (
              <input
                type="text"
                disabled
                value={formData.country}
                className="w-full bg-[#0B1114] border border-[#24363B] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F1F5F4] opacity-90 cursor-default outline-none"
              />
            )}
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
            City
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71848A]" />
            <input
              type="text"
              disabled={!isEditing}
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Greater Noida"
              className={`w-full bg-[#0B1114] border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F1F5F4] transition-all outline-none ${
                isEditing
                  ? 'border-[#35E9A0]/50 focus:border-[#35E9A0] focus:ring-1 focus:ring-[#35E9A0]/30'
                  : 'border-[#24363B] opacity-90 cursor-default'
              }`}
            />
          </div>
        </div>
      </div>

      {/* About You (Optional) */}
      <div className="mt-4">
        <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
          About You (Optional)
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-3 text-[#71848A]">
            <FileText className="w-4 h-4" />
          </div>
          <textarea
            rows={2}
            maxLength={200}
            disabled={!isEditing}
            value={formData.about}
            onChange={(e) => handleChange('about', e.target.value)}
            placeholder="Managing my finances to build a better future."
            className={`w-full bg-[#0B1114] border rounded-xl pl-10 pr-3.5 pt-2.5 pb-2 text-xs text-[#F1F5F4] transition-all outline-none resize-none ${
              isEditing
                ? 'border-[#35E9A0]/50 focus:border-[#35E9A0] focus:ring-1 focus:ring-[#35E9A0]/30'
                : 'border-[#24363B] opacity-90 cursor-default'
            }`}
          />
          <div className="flex justify-end mt-1">
            <span className="text-[11px] text-[#71848A]">
              {formData.about ? formData.about.length : 0}/200
            </span>
          </div>
        </div>
      </div>

      {/* Update Profile Picture Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in">
          <div className="bg-[#121E22] border border-[#24363B] rounded-2xl p-5 sm:p-6 max-w-md w-[92%] sm:w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#24363B]">
              <h4 className="text-sm font-bold text-[#F1F5F4] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#35E9A0]" />
                <span>Change Profile Picture</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="text-[#71848A] hover:text-[#F1F5F4] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar Preview */}
            <div className="flex flex-col items-center justify-center py-5">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#35E9A0] shadow-lg relative mb-3">
                {previewAvatar ? (
                  <img
                    src={previewAvatar}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#123D32] to-[#15372F] flex items-center justify-center text-2xl font-bold text-[#35E9A0]">
                    {getInitials(formData.name)}
                  </div>
                )}
              </div>
              <span className="text-xs text-[#A5B4B8]">
                {previewAvatar ? 'Custom Photo / Avatar' : 'Default Initials Avatar'}
              </span>
            </div>

            {/* Actions: Upload or Remove */}
            <div className="space-y-3 mb-5">
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#18272C] hover:bg-[#203238] border border-[#24363B] text-xs font-semibold text-[#F1F5F4] transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#35E9A0]" />
                  <span>Upload from Device</span>
                </button>

                {previewAvatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#FF667A]/30 text-[#FF667A] hover:bg-[#FF667A]/10 text-xs font-medium transition cursor-pointer"
                    title="Remove picture and use initials"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Preset Avatars */}
              <div>
                <label className="block text-[11px] font-medium text-[#71848A] mb-2">
                  Or select a preset avatar:
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setPreviewAvatar(av.url)}
                      className={`w-10 h-10 rounded-full overflow-hidden border transition cursor-pointer p-0.5 hover:scale-105 ${
                        previewAvatar === av.url
                          ? 'border-[#35E9A0] shadow-[0_0_8px_rgba(53,233,160,0.5)]'
                          : 'border-[#24363B] opacity-80 hover:opacity-100'
                      }`}
                      title={av.label}
                    >
                      <img src={av.url} alt={av.label} className="w-full h-full rounded-full object-cover pointer-events-none" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#24363B]">
              <button
                type="button"
                disabled={savingAvatar}
                onClick={() => setShowAvatarModal(false)}
                className="px-3.5 py-1.5 rounded-xl border border-[#24363B] text-[#A5B4B8] hover:text-[#F1F5F4] text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingAvatar}
                onClick={handleSaveAvatar}
                className="px-4 py-1.5 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {savingAvatar ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Picture</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
