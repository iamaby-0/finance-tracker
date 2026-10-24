import React from 'react';
import GoalCard from './GoalCard';
import { Target, Plus } from 'lucide-react';

export default function GoalGrid({
  goals,
  loading,
  onAddSavings,
  onViewDetails,
  onEdit,
  onDelete,
  onComplete,
  onOpenAddGoal
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-44 rounded-2xl bg-[#121E22] border border-[#24363B] animate-pulse p-4"
          />
        ))}
      </div>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-12 h-12 rounded-2xl bg-[#123D32] border border-[#35E9A0]/30 flex items-center justify-center text-[#35E9A0] mb-3">
          <Target className="w-6 h-6" />
        </div>
        <h4 className="text-sm sm:text-base font-bold text-[#F1F5F4] mb-1">
          No Financial Goals Found
        </h4>
        <p className="text-xs text-[#71848A] max-w-sm mb-4 leading-relaxed">
          You haven't created any financial goals yet. Start with something you're saving for.
        </p>
        <button
          onClick={onOpenAddGoal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] text-xs font-bold transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Your First Goal</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {goals.map((goal) => (
        <GoalCard
          key={goal._id}
          goal={goal}
          onAddSavings={onAddSavings}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onComplete={onComplete}
        />
      ))}
    </div>
  );
}
