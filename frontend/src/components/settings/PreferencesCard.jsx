import React, { useState, useEffect } from 'react';
import { Calendar, Globe, ChevronDown, Check, Loader2 } from 'lucide-react';

const CURRENCIES = [
  { code: 'INR', label: 'Indian Rupee (₹)', flag: '🇮🇳' },
  { code: 'USD', label: 'US Dollar ($)', flag: '🇺🇸' },
  { code: 'EUR', label: 'Euro (€)', flag: '🇪🇺' },
  { code: 'GBP', label: 'British Pound (£)', flag: '🇬🇧' }
];

const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
const DAYS_OF_WEEK = ['Monday', 'Sunday'];
const LANGUAGES = ['English'];

export default function PreferencesCard({ preferences, onUpdatePreferences }) {
  const [currency, setCurrency] = useState('INR');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState('Monday');
  const [language, setLanguage] = useState('English');
  const [savingKey, setSavingKey] = useState(null);
  const [savedKey, setSavedKey] = useState(null);

  useEffect(() => {
    if (preferences) {
      if (preferences.currency) setCurrency(preferences.currency);
      if (preferences.dateFormat) setDateFormat(preferences.dateFormat);
      if (preferences.firstDayOfWeek) setFirstDayOfWeek(preferences.firstDayOfWeek);
      if (preferences.language) setLanguage(preferences.language);
    }
  }, [preferences]);

  const handleUpdate = async (key, value) => {
    try {
      setSavingKey(key);

      if (key === 'currency') setCurrency(value);
      if (key === 'dateFormat') setDateFormat(value);
      if (key === 'firstDayOfWeek') setFirstDayOfWeek(value);
      if (key === 'language') setLanguage(value);

      await onUpdatePreferences({ [key]: value });

      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 2500);
    } catch (err) {
      console.error('Failed to update preference:', err);
      // rollback on error
      if (preferences) {
        setCurrency(preferences.currency || 'INR');
        setDateFormat(preferences.dateFormat || 'DD/MM/YYYY');
        setFirstDayOfWeek(preferences.firstDayOfWeek || 'Monday');
        setLanguage(preferences.language || 'English');
      }
    } finally {
      setSavingKey(null);
    }
  };

  const currentCurrencyObj = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  return (
    <div className="bg-[#121E22] border border-[#24363B] rounded-2xl p-5 shadow-sm">
      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-[#F1F5F4] tracking-tight">
            Preferences
          </h3>
          <p className="text-[11px] text-[#71848A] mt-0.5">
            Customize your finance tracking experience.
          </p>
        </div>

        {savedKey && (
          <span className="text-[11px] text-[#35E9A0] font-medium flex items-center gap-1 animate-in fade-in">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Default Currency */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#A5B4B8]">
              Default Currency
            </label>
            {savingKey === 'currency' && <Loader2 className="w-3 h-3 text-[#35E9A0] animate-spin" />}
          </div>
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => handleUpdate('currency', e.target.value)}
              className="w-full bg-[#0B1114] border border-[#24363B] rounded-xl pl-3.5 pr-8 py-2.5 text-xs text-[#F1F5F4] appearance-none focus:border-[#35E9A0]/50 outline-none transition cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71848A] pointer-events-none" />
          </div>
        </div>

        {/* Date Format */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#A5B4B8]">
              Date Format
            </label>
            {savingKey === 'dateFormat' && <Loader2 className="w-3 h-3 text-[#35E9A0] animate-spin" />}
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71848A] pointer-events-none" />
            <select
              value={dateFormat}
              onChange={(e) => handleUpdate('dateFormat', e.target.value)}
              className="w-full bg-[#0B1114] border border-[#24363B] rounded-xl pl-9 pr-8 py-2.5 text-xs text-[#F1F5F4] appearance-none focus:border-[#35E9A0]/50 outline-none transition cursor-pointer"
            >
              {DATE_FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71848A] pointer-events-none" />
          </div>
        </div>

        {/* First Day of Week */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#A5B4B8]">
              First Day of Week
            </label>
            {savingKey === 'firstDayOfWeek' && <Loader2 className="w-3 h-3 text-[#35E9A0] animate-spin" />}
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71848A] pointer-events-none" />
            <select
              value={firstDayOfWeek}
              onChange={(e) => handleUpdate('firstDayOfWeek', e.target.value)}
              className="w-full bg-[#0B1114] border border-[#24363B] rounded-xl pl-9 pr-8 py-2.5 text-xs text-[#F1F5F4] appearance-none focus:border-[#35E9A0]/50 outline-none transition cursor-pointer"
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71848A] pointer-events-none" />
          </div>
        </div>

        {/* Language */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#A5B4B8]">
              Language
            </label>
            {savingKey === 'language' && <Loader2 className="w-3 h-3 text-[#35E9A0] animate-spin" />}
          </div>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71848A] pointer-events-none" />
            <select
              value={language}
              onChange={(e) => handleUpdate('language', e.target.value)}
              className="w-full bg-[#0B1114] border border-[#24363B] rounded-xl pl-9 pr-8 py-2.5 text-xs text-[#F1F5F4] appearance-none focus:border-[#35E9A0]/50 outline-none transition cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71848A] pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
