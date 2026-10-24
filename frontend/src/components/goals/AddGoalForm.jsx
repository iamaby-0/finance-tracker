import React, { useState } from 'react';
import {
  Car,
  Home,
  Plane,
  GraduationCap,
  Laptop,
  Heart,
  MoreHorizontal,
  Calendar,
  Check,
  Loader2
} from 'lucide-react';

export default function AddGoalForm({ onSubmit, loading }) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Vehicle');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Car');
  const [selectedColor, setSelectedColor] = useState('#35E9A0');
  const [error, setError] = useState('');

  const icons = [
    { id: 'Car', icon: Car },
    { id: 'Home', icon: Home },
    { id: 'Plane', icon: Plane },
    { id: 'GraduationCap', icon: GraduationCap },
    { id: 'Laptop', icon: Laptop },
    { id: 'Heart', icon: Heart },
    { id: 'Target', icon: MoreHorizontal }
  ];

  const colors = [
    '#35E9A0', // Mint
    '#45B7F5', // Blue
    '#B18AFF', // Purple
    '#F6C85F', // Yellow
    '#FF667A', // Coral
    '#20D6C7'  // Teal
  ];

  const categories = [
    'Vehicle',
    'Home',
    'Travel',
    'Education',
    'Emergency Fund',
    'Technology',
    'Health',
    'Investment',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a goal name');
      return;
    }
    const amountNum = Number(targetAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid positive target amount');
      return;
    }
    if (!targetDate) {
      setError('Please select a target date');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        targetAmount: amountNum,
        targetDate,
        category,
        description: description.trim(),
        icon: selectedIcon,
        color: selectedColor
      });

      // Reset form
      setName('');
      setTargetAmount('');
      setTargetDate('');
      setDescription('');
      setSelectedIcon('Car');
      setSelectedColor('#35E9A0');
    } catch (err) {
      setError(err.message || 'Failed to create goal');
    }
  };

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4.5 sm:p-5 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
        Add New Goal
      </h3>

      {error && (
        <div className="p-2.5 rounded-xl bg-[#3D1A22] border border-[#FF667A]/30 text-xs text-[#FF667A]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Row 1: Goal Name & Target Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Goal Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Buy a Car, Europe Trip"
              className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Target Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71848A]">
                ₹
              </span>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="e.g. 1000000"
                min="1"
                className="w-full h-10 pl-7 pr-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] transition"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Target Date & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Target Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] transition [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] transition cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#18272C] text-[#F1F5F4]">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Description (Optional) */}
        <div>
          <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Add a short description..."
            className="w-full px-3 py-2 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] transition resize-none"
          />
        </div>

        {/* Row 4: Selectable Icons */}
        <div>
          <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
            Icon
          </label>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {icons.map((item) => {
              const IconComp = item.icon;
              const isSelected = selectedIcon === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedIcon(item.id)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#123D32] border-2 border-[#35E9A0] text-[#35E9A0] shadow-sm scale-105'
                      : 'bg-[#18272C] border border-[#24363B] text-[#71848A] hover:text-[#A5B4B8] hover:border-[#35E9A0]/30'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 5: Selectable Colors */}
        <div>
          <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
            Color Accent
          </label>
          <div className="flex items-center gap-2.5 py-1">
            {colors.map((c) => {
              const isSelected = selectedColor === c;
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-[#F1F5F4] ring-offset-2 ring-offset-[#121E22] scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  aria-label={`Select color ${c}`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#0B1114] stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 mt-2 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] font-bold text-xs tracking-wide transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#0B1114]" />
              <span>Creating Goal...</span>
            </>
          ) : (
            <span>Create Goal</span>
          )}
        </button>
      </form>
    </div>
  );
}
