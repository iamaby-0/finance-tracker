import React, { useState, useRef, useEffect } from 'react';
import {
  Car,
  Home,
  Plane,
  GraduationCap,
  Laptop,
  Shield,
  Heart,
  Briefcase,
  PiggyBank,
  Target,
  MoreVertical,
  PlusCircle,
  Eye,
  Edit2,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export default function GoalCard({
  goal,
  onAddSavings,
  onViewDetails,
  onEdit,
  onDelete,
  onComplete
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const iconMap = {
    Car,
    Home,
    Plane,
    GraduationCap,
    Laptop,
    Shield,
    Heart,
    Briefcase,
    PiggyBank,
    Target
  };

  const IconComponent = iconMap[goal.icon] || Target;

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatINR = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

  const formatTargetDate = (dateVal) => {
    if (!dateVal) return '';
    const d = new Date(dateVal);
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `${month} ${year}`;
  };

  const progress = goal.targetAmount > 0
    ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
    : 0;

  const isCompleted = goal.status === 'completed' || progress >= 100;
  const paceStatus = isCompleted ? 'Completed' : (goal.paceStatus || 'Active');

  // Status badge styling
  const statusBadges = {
    'On Track': 'bg-[#123D32] text-[#35E9A0] border border-[#35E9A0]/30',
    'Completed': 'bg-[#123D32] text-[#35E9A0] border border-[#35E9A0]/30',
    'At Risk': 'bg-[#3D1A22] text-[#FF667A] border border-[#FF667A]/30',
    'Active': 'bg-[#18384D] text-[#45B7F5] border border-[#45B7F5]/30',
    'Paused': 'bg-[#18272C] text-[#71848A] border border-[#24363B]'
  };

  // Icon background mapping
  const iconBgMap = {
    '#B18AFF': 'bg-[#2A1A40] text-[#B18AFF]',
    '#FF667A': 'bg-[#3D1A22] text-[#FF667A]',
    '#45B7F5': 'bg-[#18384D] text-[#45B7F5]',
    '#35E9A0': 'bg-[#123D32] text-[#35E9A0]',
    '#F6C85F': 'bg-[#382D12] text-[#F6C85F]',
    '#20D6C7': 'bg-[#123835] text-[#20D6C7]'
  };

  const iconStyle = iconBgMap[goal.color] || 'bg-[#123D32] text-[#35E9A0]';

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-4.5 hover:border-[#35E9A0]/30 transition-all duration-200 flex flex-col justify-between shadow-sm relative group">
      <div>
        {/* Top Header: Icon, Status Badge, Three-dot Menu */}
        <div className="flex items-center justify-between mb-3.5">
          {/* Icon in colored rounded container */}
          <div className={`w-9 h-9 rounded-xl ${iconStyle} flex items-center justify-center shrink-0 shadow-xs`}>
            <IconComponent className="w-4.5 h-4.5" />
          </div>

          <div className="flex items-center gap-1.5">
            {/* Status Pill Badge */}
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${statusBadges[paceStatus] || statusBadges['Active']}`}>
              {paceStatus}
            </span>

            {/* Three-dot dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C] transition cursor-pointer"
                aria-label="Goal options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl p-1 z-30 animate-in fade-in zoom-in-95 duration-100 text-xs">
                  {!isCompleted && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onAddSavings(goal);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#35E9A0] hover:bg-[#123D32]/50 transition text-left cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Savings</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onViewDetails(goal);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#203238] transition text-left cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#45B7F5]" />
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(goal);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#203238] transition text-left cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#F6C85F]" />
                    <span>Edit Goal</span>
                  </button>
                  {!isCompleted && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onComplete(goal);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#A5B4B8] hover:text-[#35E9A0] hover:bg-[#203238] transition text-left cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#35E9A0]" />
                      <span>Mark as Complete</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(goal);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#FF667A] hover:bg-[#3D1A22]/50 transition text-left cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Goal</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-0.5 mb-3">
          <h4 className="text-sm font-bold text-[#F1F5F4] truncate tracking-tight">
            {goal.name}
          </h4>
          <p className="text-[11px] text-[#71848A] truncate">
            {goal.description || `Category: ${goal.category}`}
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-1.5 mb-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#F1F5F4]">{progress}%</span>
          </div>

          <div className="w-full h-1.5 bg-[#18272C] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#35E9A0] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Info: Saved/Target & Date */}
      <div className="pt-2 border-t border-[#24363B]/50 flex items-center justify-between text-xs">
        <span className="font-semibold text-[#F1F5F4] tracking-tight">
          {formatINR(goal.currentAmount)} <span className="text-[#71848A] font-normal">/ {formatINR(goal.targetAmount)}</span>
        </span>

        <span className="text-[10px] text-[#71848A] font-medium">
          {isCompleted && goal.completedAt
            ? `Completed: ${formatTargetDate(goal.completedAt)}`
            : `Target: ${formatTargetDate(goal.targetDate)}`}
        </span>
      </div>
    </div>
  );
}
