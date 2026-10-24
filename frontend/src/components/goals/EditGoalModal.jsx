import React, { useState, useEffect } from 'react';
import {
  X,
  Edit2,
  Car,
  Home,
  Plane,
  GraduationCap,
  Laptop,
  Heart,
  MoreHorizontal,
  Check,
  Loader2
} from 'lucide-react';

export default function EditGoalModal({ goal, isOpen, onClose, onSave, loading }) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Vehicle');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Car');
  const [color, setColor] = useState('#35E9A0');
  const [status, setStatus] = useState('active');
  const [error, setError] = useState('');

  useEffect(() => {
    if (goal) {
      setName(goal.name || '');
      setTargetAmount(goal.targetAmount || '');
      setTargetDate(
        goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : ''
      );
      setCategory(goal.category || 'Other');
      setDescription(goal.description || '');
      setIcon(goal.icon || 'Target');
      setColor(goal.color || '#35E9A0');
      setStatus(goal.status || 'active');
    }
  }, [goal]);

  if (!isOpen || !goal) return null;

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
    '#35E9A0',
    '#45B7F5',
    '#B18AFF',
    '#F6C85F',
    '#FF667A',
    '#20D6C7'
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
    const amt = Number(targetAmount);
    if (isNaN(amt) || amt <= 0) {
      setError('Please enter a valid positive target amount');
      return;
    }
    if (!targetDate) {
      setError('Please select a target date');
      return;
    }

    try {
      await onSave(goal._id, {
        name: name.trim(),
        targetAmount: amt,
        targetDate,
        category,
        description: description.trim(),
        icon,
        color,
        status
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update goal');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#121E22] border border-[#24363B] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[calc(100dvh-1.5rem)] my-auto overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#24363B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#382D12] flex items-center justify-center text-[#F6C85F]">
              <Edit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F1F5F4]">Edit Goal</h3>
              <p className="text-[11px] text-[#71848A]">{goal.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-[#3D1A22] border border-[#FF667A]/30 text-xs text-[#FF667A]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
                Goal Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
                Target Amount (₹)
              </label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                min="1"
                required
                className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] transition [color-scheme:dark]"
              />
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

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] focus:outline-none focus:border-[#35E9A0] transition cursor-pointer"
            >
              <option value="active" className="bg-[#18272C] text-[#F1F5F4]">Active</option>
              <option value="completed" className="bg-[#18272C] text-[#F1F5F4]">Completed</option>
              <option value="paused" className="bg-[#18272C] text-[#F1F5F4]">Paused</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-[#18272C] border border-[#24363B] text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none focus:border-[#35E9A0] transition resize-none"
            />
          </div>

          {/* Icons & Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
                Icon
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                {icons.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = icon === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setIcon(item.id)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#123D32] border border-[#35E9A0] text-[#35E9A0]'
                          : 'bg-[#18272C] border border-[#24363B] text-[#71848A]'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A5B4B8] mb-1.5">
                Color
              </label>
              <div className="flex items-center gap-2 py-1">
                {colors.map((c) => {
                  const isSelected = color === c;
                  return (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isSelected ? 'ring-2 ring-[#F1F5F4] ring-offset-2 ring-offset-[#121E22]' : 'opacity-80'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#0B1114] stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl bg-[#18272C] hover:bg-[#203238] border border-[#24363B] text-xs font-semibold text-[#A5B4B8] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-10 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0B1114]" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
