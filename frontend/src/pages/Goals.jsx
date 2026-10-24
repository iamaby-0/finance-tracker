import React, { useState, useEffect, useCallback, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import GoalSummaryCards from '../components/goals/GoalSummaryCards';
import GoalFilters from '../components/goals/GoalFilters';
import GoalGrid from '../components/goals/GoalGrid';
import AddGoalForm from '../components/goals/AddGoalForm';
import AddSavingsModal from '../components/goals/AddSavingsModal';
import EditGoalModal from '../components/goals/EditGoalModal';
import GoalDetailsModal from '../components/goals/GoalDetailsModal';
import SavingsProgressChart from '../components/goals/SavingsProgressChart';
import GoalAllocationChart from '../components/goals/GoalAllocationChart';
import GoalRecommendations from '../components/goals/GoalRecommendations';
import { Target, Plus } from 'lucide-react';

export function Goals() {
  const { user, logout } = useAuth();

  // Navigation & filter states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Goals');
  const [sortBy, setSortBy] = useState('Target Date');

  // Data states
  const [goals, setGoals] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [savingsModalGoal, setSavingsModalGoal] = useState(null);
  const [editModalGoal, setEditModalGoal] = useState(null);
  const [detailsModalGoal, setDetailsModalGoal] = useState(null);
  const [deleteConfirmGoal, setDeleteConfirmGoal] = useState(null);

  const formSectionRef = useRef(null);

  // Fetch all goals & analytics
  const fetchGoalsData = useCallback(async () => {
    try {
      setLoading(true);
      const [goalsRes, analyticsRes] = await Promise.allSettled([
        api.get('/goals', {
          params: {
            status: activeFilter === 'All Goals' ? 'All' : activeFilter,
            sortBy,
            search: searchQuery
          }
        }),
        api.get('/goals/analytics')
      ]);

      if (goalsRes.status === 'fulfilled' && goalsRes.value.data?.success) {
        setGoals(goalsRes.value.data.data || []);
      }
      if (analyticsRes.status === 'fulfilled' && analyticsRes.value.data?.success) {
        setAnalytics(analyticsRes.value.data.data || null);
      }
    } catch (err) {
      console.warn('Goals data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, sortBy, searchQuery]);

  useEffect(() => {
    fetchGoalsData();
  }, [fetchGoalsData]);

  // Compute tab counts from current unfiltered data or analytics summary
  const counts = {
    all: analytics?.summary?.totalGoals || goals.length || 5,
    active: analytics?.summary?.activeGoals || 3,
    completed: analytics?.summary?.completedGoals || 2,
    onTrack: analytics?.summary?.onTrackCount || 3,
    atRisk: analytics?.summary?.atRiskCount || 1
  };

  // Handlers
  const handleCreateGoal = async (goalData) => {
    setActionLoading(true);
    try {
      await api.post('/goals', goalData);
      await fetchGoalsData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddSavings = async (goalId, savingsData) => {
    setActionLoading(true);
    try {
      await api.post(`/goals/${goalId}/savings`, savingsData);
      await fetchGoalsData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditGoal = async (goalId, updateData) => {
    setActionLoading(true);
    try {
      await api.put(`/goals/${goalId}`, updateData);
      await fetchGoalsData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteGoal = async (goal) => {
    setDeleteConfirmGoal(goal);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmGoal) return;
    setActionLoading(true);
    try {
      await api.delete(`/goals/${deleteConfirmGoal._id}`);
      setDeleteConfirmGoal(null);
      await fetchGoalsData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteGoal = async (goal) => {
    setActionLoading(true);
    try {
      await api.put(`/goals/${goal._id}`, { status: 'completed' });
      await fetchGoalsData();
    } finally {
      setActionLoading(false);
    }
  };

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    const nameInput = formSectionRef.current?.querySelector('input');
    nameInput?.focus();
  };

  return (
    <div className="min-h-screen bg-[#0B1114] text-[#F1F5F4] flex">
      {/* Sidebar - Permanent on desktop */}
      <Sidebar
        activeItem="Goals"
        user={user}
        onLogout={logout}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          user={user}
          onLogout={logout}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search goals, transactions, or ask AI..."
        />

        {/* Goals Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1700px] w-full mx-auto space-y-6">
          {/* Header Row: Title & Add New Goal Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight flex items-center gap-2">
                  <span>Goals</span>
                  <Target className="w-5 h-5 text-[#35E9A0]" />
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#71848A] mt-1 font-normal leading-relaxed">
                Turn your dreams into reality. Set financial goals and track your progress with AI guidance.
              </p>
            </div>

            {/* Mint Green + Add New Goal Button */}
            <button
              onClick={scrollToForm}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] text-xs font-bold transition shadow-md shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Add New Goal</span>
            </button>
          </div>

          {/* 1. Four Summary Cards */}
          <GoalSummaryCards summary={analytics?.summary} loading={loading} />

          {/* 2. Middle Section: Goals Grid on Left (~68%), Add New Goal Form on Right (~32%) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
            {/* Left: Goals Grid Section */}
            <div className="xl:col-span-8 space-y-4">
              <GoalFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                counts={counts}
              />

              <GoalGrid
                goals={goals}
                loading={loading}
                onAddSavings={(goal) => setSavingsModalGoal(goal)}
                onViewDetails={(goal) => setDetailsModalGoal(goal)}
                onEdit={(goal) => setEditModalGoal(goal)}
                onDelete={handleDeleteGoal}
                onComplete={handleCompleteGoal}
                onOpenAddGoal={scrollToForm}
              />
            </div>

            {/* Right: Add New Goal Form */}
            <div className="xl:col-span-4" ref={formSectionRef}>
              <AddGoalForm onSubmit={handleCreateGoal} loading={actionLoading} />
            </div>
          </div>

          {/* 3. Bottom Row: 3 Analytics Cards (Savings Progress, Allocation, AI Recommendations) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 pt-2">
            <SavingsProgressChart data={analytics?.savingsProgressOverTime} />
            <GoalAllocationChart
              allocation={analytics?.goalAllocation}
              totalTargetAmount={analytics?.summary?.totalTargetAmount}
            />
            <GoalRecommendations
              recommendations={analytics?.aiRecommendations}
              onSelectGoal={(gId) => {
                const found = goals.find((g) => g._id === gId);
                if (found) setDetailsModalGoal(found);
              }}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddSavingsModal
        goal={savingsModalGoal}
        isOpen={!!savingsModalGoal}
        onClose={() => setSavingsModalGoal(null)}
        onConfirm={handleAddSavings}
        loading={actionLoading}
      />

      <EditGoalModal
        goal={editModalGoal}
        isOpen={!!editModalGoal}
        onClose={() => setEditModalGoal(null)}
        onSave={handleEditGoal}
        loading={actionLoading}
      />

      <GoalDetailsModal
        goal={detailsModalGoal}
        isOpen={!!detailsModalGoal}
        onClose={() => setDetailsModalGoal(null)}
        onAddSavings={(goal) => setSavingsModalGoal(goal)}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-[#121E22] border border-[#24363B] p-5 shadow-2xl space-y-3.5">
            <h3 className="text-sm font-bold text-[#F1F5F4]">Delete Financial Goal?</h3>
            <p className="text-xs text-[#A5B4B8] leading-relaxed">
              Are you sure you want to delete <strong className="text-[#F1F5F4]">{deleteConfirmGoal.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmGoal(null)}
                className="flex-1 h-9 rounded-xl bg-[#18272C] hover:bg-[#203238] border border-[#24363B] text-xs font-semibold text-[#A5B4B8] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={actionLoading}
                className="flex-1 h-9 rounded-xl bg-[#FF667A] hover:bg-[#FF8090] text-[#0B1114] text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goals;
