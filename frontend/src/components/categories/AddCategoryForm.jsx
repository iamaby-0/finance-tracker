import React, { useState } from 'react';
import {
  Utensils,
  ShoppingBag,
  Car,
  Receipt,
  Gamepad,
  Heart,
  MoreHorizontal,
  Wallet,
  Briefcase
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { id: 'Utensils', icon: Utensils },
  { id: 'ShoppingBag', icon: ShoppingBag },
  { id: 'Car', icon: Car },
  { id: 'Receipt', icon: Receipt },
  { id: 'Gamepad', icon: Gamepad },
  { id: 'Heart', icon: Heart },
  { id: 'MoreHorizontal', icon: MoreHorizontal }
];

const COLOR_SWATCHES = [
  '#FF667A', // Coral Red
  '#B18AFF', // Purple
  '#45B7F5', // Blue
  '#3B82F6', // Indigo
  '#F6C85F', // Yellow
  '#F59E0B', // Orange
  '#20D6C7', // Cyan
  '#F472B6', // Pink
  '#35E9A0'  // Mint
];

export default function AddCategoryForm({ onCategoryCreated }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Expense');
  const [selectedIcon, setSelectedIcon] = useState('Utensils');
  const [selectedColor, setSelectedColor] = useState('#FF667A');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (onCategoryCreated) {
        await onCategoryCreated({
          name: name.trim(),
          type,
          icon: selectedIcon,
          color: selectedColor,
          description: description.trim()
        });
      }

      setSuccess('Category created successfully!');
      setName('');
      setDescription('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 flex flex-col justify-between h-full shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
          Add New Category
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 my-auto">
        {/* Field 1: Category Name */}
        <div>
          <label className="block text-xs font-semibold text-[#A5B4B8] mb-1.5">
            Category Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Groceries, Rent, etc."
            className="w-full bg-[#18272C] border border-[#24363B] rounded-xl px-3.5 py-2.5 text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0]/50 transition"
          />
        </div>

        {/* Field 2: Type (Expense / Income) */}
        <div>
          <label className="block text-xs font-semibold text-[#A5B4B8] mb-1.5">
            Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setType('Expense');
                if (selectedColor === '#35E9A0') setSelectedColor('#FF667A');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                type === 'Expense'
                  ? 'bg-[#2A161B] border-[#FF667A] text-[#FF667A] shadow-xs'
                  : 'bg-[#18272C] border-[#24363B] text-[#A5B4B8] hover:text-[#F1F5F4]'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Expense</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('Income');
                if (selectedColor === '#FF667A') setSelectedColor('#35E9A0');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                type === 'Income'
                  ? 'bg-[#123D32] border-[#35E9A0] text-[#35E9A0] shadow-xs'
                  : 'bg-[#18272C] border-[#24363B] text-[#A5B4B8] hover:text-[#F1F5F4]'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Income</span>
            </button>
          </div>
        </div>

        {/* Field 3: Icon Selector */}
        <div>
          <label className="block text-xs font-semibold text-[#A5B4B8] mb-1.5">
            Icon
          </label>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {AVAILABLE_ICONS.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedIcon === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIcon(item.id)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border transition flex-shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#15372F] border-[#35E9A0] text-[#35E9A0] shadow-xs scale-105'
                      : 'bg-[#18272C] border-[#24363B] text-[#71848A] hover:text-[#A5B4B8]'
                  }`}
                  aria-label={item.id}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Field 4: Color Swatches */}
        <div>
          <label className="block text-xs font-semibold text-[#A5B4B8] mb-1.5">
            Color
          </label>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {COLOR_SWATCHES.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full transition-transform cursor-pointer flex-shrink-0 ${
                    isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#121E22] scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={color}
                />
              );
            })}
          </div>
        </div>

        {/* Field 5: Description (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-[#A5B4B8] mb-1.5">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a short description..."
            rows={2}
            className="w-full bg-[#18272C] border border-[#24363B] rounded-xl px-3.5 py-2 text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0]/50 transition resize-none"
          />
        </div>

        {/* Messages */}
        {error && (
          <p className="text-xs text-[#FF667A] font-medium animate-in fade-in">
            {error}
          </p>
        )}
        {success && (
          <p className="text-xs text-[#35E9A0] font-medium animate-in fade-in">
            {success}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] text-xs font-bold transition shadow-md hover:shadow-[#35E9A0]/20 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#0B1114] border-t-transparent rounded-full animate-spin" />
          ) : (
            'Create Category'
          )}
        </button>
      </form>
    </div>
  );
}
