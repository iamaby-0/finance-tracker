import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import BudgetSummaryCards from '../components/budgets/BudgetSummaryCards';
import BudgetCategoryList, { getCategoryConfig } from '../components/budgets/BudgetCategoryList';
import BudgetComparisonChart from '../components/budgets/BudgetComparisonChart';
import CreateBudgetForm from '../components/budgets/CreateBudgetForm';
import RecentBudgetActivity from '../components/budgets/RecentBudgetActivity';
import BudgetInsights from '../components/budgets/BudgetInsights';
import EditBudgetModal from '../components/budgets/EditBudgetModal';
import { Target, Calendar, ChevronDown } from 'lucide-react';
import { compareLatestFirst } from '../utils/formatters';

export function Budgets() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Period selector
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const periodDropdownRef = useRef(null);

  // Edit Modal State
  const [editingBudget, setEditingBudget] = useState(null);

  // Live Backend Data States
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(e.target)) {
        setPeriodDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch live budgets and expenses
  const fetchBudgetData = useCallback(async () => {
    try {
      setLoading(true);
      const [budgetRes, expenseRes] = await Promise.allSettled([
        api.get('/budget'),
        api.get('/expenses')
      ]);

      if (budgetRes.status === 'fulfilled' && budgetRes.value.data?.data) {
        setBudgets(Array.isArray(budgetRes.value.data.data) ? budgetRes.value.data.data : []);
      }

      if (expenseRes.status === 'fulfilled' && expenseRes.value.data?.data) {
        const expData = Array.isArray(expenseRes.value.data.data) ? expenseRes.value.data.data : [];
        setExpenses([...expData].sort(compareLatestFirst));
      }
    } catch (err) {
      console.warn('Budget data fetch notice:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  const hasLiveBudgets = budgets.length > 0;

  // Compute category spending from expenses
  const getCategorySpendMap = () => {
    const map = {};
    expenses.forEach((exp) => {
      const cat = exp.category || 'Other';
      map[cat] = (map[cat] || 0) + (Number(exp.amount) || 0);
    });
    return map;
  };

  const spendMap = getCategorySpendMap();

  // Calculate live or fallback metrics
  const getMetrics = () => {
    if (hasLiveBudgets) {
      const totalBudget = budgets.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
      let totalSpent = 0;
      let overBudgetCount = 0;

      budgets.forEach((b) => {
        const spent = spendMap[b.category] || 0;
        totalSpent += spent;
        if (spent > Number(b.amount)) {
          overBudgetCount++;
        }
      });

      return {
        totalBudget,
        overallSpent: totalSpent,
        categoriesCount: budgets.length,
        overBudgetCount
      };
    }

    if (selectedPeriod === 'Last Month') {
      return {
        totalBudget: 65000,
        overallSpent: 42250,
        categoriesCount: 6,
        overBudgetCount: 0
      };
    }

    if (selectedPeriod === 'This Year') {
      return {
        totalBudget: 840000,
        overallSpent: 571200,
        categoriesCount: 6,
        overBudgetCount: 2
      };
    }

    // Default reference metrics for 'This Month'
    return {
      totalBudget: 70000,
      overallSpent: 47650,
      categoriesCount: 6,
      overBudgetCount: 1
    };
  };

  const metrics = getMetrics();

  // Format category list items
  const getCategoryListItems = () => {
    if (hasLiveBudgets) {
      return budgets.map((b) => {
        const cfg = getCategoryConfig(b.category);
        const spent = spendMap[b.category] || 0;
        const budgetAmount = Number(b.amount) || 0;
        const pct = budgetAmount > 0 ? Math.round((spent / budgetAmount) * 100) : 0;

        let status = 'On Track';
        if (pct > 100) status = 'Over Budget';
        else if (pct >= 80) status = 'Near Limit';

        return {
          id: b._id,
          name: cfg.displayName,
          category: b.category,
          spent,
          budget: budgetAmount,
          percentage: pct,
          status,
          color: cfg.color,
          iconBg: cfg.iconBg,
          iconColor: cfg.iconColor,
          icon: cfg.icon
        };
      });
    }
    return null; // Will fallback to DEFAULT_CATEGORIES in component
  };

  // Format chart data for Budget vs Spending
  const getChartData = () => {
    if (hasLiveBudgets) {
      return budgets.map((b) => {
        const cfg = getCategoryConfig(b.category);
        const spent = spendMap[b.category] || 0;
        const budgetVal = Number(b.amount) || 0;
        const shortName = cfg.displayName.length > 8 ? cfg.displayName.slice(0, 7) + '...' : cfg.displayName;

        return {
          category: shortName,
          fullCategory: cfg.displayName,
          budget: budgetVal,
          spent
        };
      });
    }
    return null; // Will fallback to DEFAULT_CHART_DATA in component
  };

  // Status mapping for RecentBudgetActivity
  const getCategoryStatusMap = () => {
    const statusMap = {};
    if (hasLiveBudgets) {
      budgets.forEach((b) => {
        const spent = spendMap[b.category] || 0;
        const budgetVal = Number(b.amount) || 0;
        const pct = budgetVal > 0 ? (spent / budgetVal) * 100 : 0;
        if (pct > 100) statusMap[b.category] = 'Over Budget';
        else if (pct >= 80) statusMap[b.category] = 'Near Limit';
        else statusMap[b.category] = 'On Track';
      });
    }
    return statusMap;
  };

  // Dynamic AI Budget Insights
  const getDynamicInsights = () => {
    if (hasLiveBudgets) {
      const items = [];

      // 1. Check for highest usage / near limit budget
      let highestUsageBudget = null;
      let highestUsagePct = -1;

      budgets.forEach((b) => {
        const spent = spendMap[b.category] || 0;
        const budgetVal = Number(b.amount) || 0;
        const pct = budgetVal > 0 ? Math.round((spent / budgetVal) * 100) : 0;
        if (pct > highestUsagePct) {
          highestUsagePct = pct;
          highestUsageBudget = b;
        }
      });

      if (highestUsageBudget) {
        const cfg = getCategoryConfig(highestUsageBudget.category);
        items.push({
          id: 'dyn-1',
          title: `You've used ${highestUsagePct}% of your ${cfg.displayName.toLowerCase()} budget`,
          description: highestUsagePct >= 80
            ? `You're close to your ${cfg.displayName.toLowerCase()} limit. Consider reducing non-essential purchases.`
            : `Your ${cfg.displayName.toLowerCase()} spending is well within budget.`,
          icon: cfg.icon,
          iconBg: highestUsagePct >= 80 ? 'bg-[#3D1A22]' : 'bg-[#123D32]',
          iconColor: highestUsagePct >= 80 ? 'text-[#FF667A]' : 'text-[#35E9A0]',
          hoverBorder: highestUsagePct >= 80 ? 'hover:border-[#FF667A]/30' : 'hover:border-[#35E9A0]/30'
        });
      }

      // 2. Good budget control count
      let onTrackCount = 0;
      budgets.forEach((b) => {
        const spent = spendMap[b.category] || 0;
        const budgetVal = Number(b.amount) || 0;
        if (budgetVal > 0 && (spent / budgetVal) < 0.8) {
          onTrackCount++;
        }
      });

      items.push({
        id: 'dyn-2',
        title: 'Good budget control',
        description: `You're on track with ${onTrackCount} out of ${budgets.length} budgets this month. Keep it up!`,
        iconBg: 'bg-[#123D32]',
        iconColor: 'text-[#35E9A0]',
        hoverBorder: 'hover:border-[#35E9A0]/30'
      });

      // 3. Opportunity to save
      items.push({
        id: 'dyn-3',
        title: 'Opportunity to save',
        description: 'You are managing your expenditures well. Consider allocating leftover budget to your savings goal.',
        iconBg: 'bg-[#382818]',
        iconColor: 'text-[#F6C85F]',
        hoverBorder: 'hover:border-[#F6C85F]/30'
      });

      return items;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#0B1114] text-[#F1F5F4] flex">
      {/* 1. Left Sidebar (Budgets active) */}
      <Sidebar
        activeItem="Budgets"
        onLogout={logout}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#0B1114]">
        {/* Top Navigation Bar */}
        <Navbar
          user={user}
          onLogout={logout}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search budgets, categories, or transactions..."
        />

        {/* Budgets Workspace */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1600px] w-full mx-auto">
          {/* Header Row: Title & Date Range */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-[28px] font-bold text-[#F1F5F4] tracking-tight">
                  Budgets
                </h1>
                <div className="w-6 h-6 rounded-md bg-[#3D1A22] border border-[#FF667A]/30 flex items-center justify-center text-[#FF667A]">
                  <Target className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#A5B4B8] mt-0.5">
                Plan, track, and manage your budgets to build better financial habits.
              </p>
            </div>

            {/* Date Range Selector Dropdown */}
            <div className="relative self-start sm:self-auto" ref={periodDropdownRef}>
              <button
                type="button"
                onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121E22] border border-[#24363B] text-xs text-[#F1F5F4] hover:border-[#35E9A0]/50 transition cursor-pointer shadow-xs"
              >
                <Calendar className="w-4 h-4 text-[#A5B4B8]" />
                <span className="font-medium">{selectedPeriod}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#71848A] transition-transform duration-200 ${
                    periodDropdownOpen ? 'rotate-180 text-[#35E9A0]' : ''
                  }`}
                />
              </button>

              {periodDropdownOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {['This Month', 'Last Month', 'This Year'].map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => {
                        setSelectedPeriod(range);
                        setPeriodDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-xs text-left transition cursor-pointer ${
                        selectedPeriod === range
                          ? 'text-[#35E9A0] bg-[#15372F] font-medium'
                          : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#203238]'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. Four KPI Summary Cards */}
          <BudgetSummaryCards
            totalBudget={metrics.totalBudget}
            overallSpent={metrics.overallSpent}
            categoriesCount={metrics.categoriesCount}
            overBudgetCount={metrics.overBudgetCount}
          />

          {/* 4. Main Row: 3 Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[38fr_30fr_32fr] gap-4 sm:gap-5">
            {/* Card A: Budget by Category */}
            <div className="min-w-0">
              <BudgetCategoryList
                categories={getCategoryListItems()}
                onEditBudget={(item) => setEditingBudget(item)}
                onViewAll={() => navigate('/categories')}
              />
            </div>

            {/* Card B: Budget vs Spending */}
            <div className="min-w-0">
              <BudgetComparisonChart
                data={getChartData()}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>

            {/* Card C: Create New Budget */}
            <div className="lg:col-span-2 xl:col-span-1 min-w-0">
              <CreateBudgetForm
                onSuccess={fetchBudgetData}
              />
            </div>
          </div>

          {/* 5. Bottom Row: Activity (~54%) & Insights (~46%) */}
          <div className="grid grid-cols-1 lg:grid-cols-[54fr_46fr] gap-4 sm:gap-5 pb-6">
            {/* Recent Budget Activity (~54%) */}
            <div className="min-w-0">
              <RecentBudgetActivity
                expenses={expenses}
                categoryStatusMap={getCategoryStatusMap()}
                onViewAll={() => navigate('/transactions?type=Expenses')}
              />
            </div>

            {/* Budget Insights (~46%) */}
            <div className="min-w-0">
              <BudgetInsights
                insights={getDynamicInsights()}
                onViewAll={() => navigate('/ai-insights')}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Edit Budget Modal */}
      {editingBudget && (
        <EditBudgetModal
          isOpen={Boolean(editingBudget)}
          budget={editingBudget}
          onClose={() => setEditingBudget(null)}
          onSuccess={fetchBudgetData}
        />
      )}
    </div>
  );
}

export default Budgets;
