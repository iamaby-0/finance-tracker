import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import CategorySummaryCard from '../components/categories/CategorySummaryCard';
import CategoryGrid from '../components/categories/CategoryGrid';
import AddCategoryForm from '../components/categories/AddCategoryForm';
import CategorySpendingTrend from '../components/categories/CategorySpendingTrend';
import RecentCategoryTransactions from '../components/categories/RecentCategoryTransactions';
import { LayoutGrid, Calendar, ChevronDown } from 'lucide-react';

const INITIAL_CATEGORIES = [
  // 8 Expense Categories
  { id: '1', name: 'Food & Dining', type: 'Expense', icon: 'Utensils', color: '#FF667A', amount: 11850, percentage: 28, isCustom: false },
  { id: '2', name: 'Shopping', type: 'Expense', icon: 'ShoppingBag', color: '#B18AFF', amount: 7620, percentage: 18, isCustom: false },
  { id: '3', name: 'Transport', type: 'Expense', icon: 'Car', color: '#45B7F5', amount: 5930, percentage: 14, isCustom: false },
  { id: '4', name: 'Bills & Utilities', type: 'Expense', icon: 'FileText', color: '#F6C85F', amount: 5120, percentage: 12, isCustom: false },
  { id: '5', name: 'Entertainment', type: 'Expense', icon: 'Gamepad', color: '#FF6EA7', amount: 4230, percentage: 10, isCustom: false },
  { id: '6', name: 'Health & Fitness', type: 'Expense', icon: 'Heart', color: '#FF8A48', amount: 3400, percentage: 8, isCustom: false },
  { id: '7', name: 'Others', type: 'Expense', icon: 'MoreHorizontal', color: '#A5B4B8', amount: 4200, percentage: 10, isCustom: false },
  { id: '8', name: 'Custom Category', type: 'Expense', icon: 'Utensils', color: '#20D6C7', amount: 1100, percentage: 3, isCustom: true },
  // 4 Income Categories
  { id: '9', name: 'Salary', type: 'Income', icon: 'Briefcase', color: '#35E9A0', amount: 70000, percentage: 82, isCustom: false },
  { id: '10', name: 'Freelance', type: 'Income', icon: 'Laptop', color: '#B18AFF', amount: 8500, percentage: 10, isCustom: false },
  { id: '11', name: 'Investment', type: 'Income', icon: 'TrendingUp', color: '#F6C85F', amount: 4200, percentage: 5, isCustom: false },
  { id: '12', name: 'Side Income', type: 'Income', icon: 'Coins', color: '#FF8A48', amount: 2300, percentage: 3, isCustom: false }
];

export function Categories() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation and search states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [catSearchQuery, setCatSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  // Period selectors
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [trendPeriod, setTrendPeriod] = useState('Last 6 Months');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const dateDropdownRef = useRef(null);

  // Live Backend Data States
  const [backendCategories, setBackendCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Close date dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target)) {
        setDateDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch all categories, expenses, and incomes
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [catRes, expRes, incRes] = await Promise.allSettled([
        api.get('/categories'),
        api.get('/expenses'),
        api.get('/income')
      ]);

      if (catRes.status === 'fulfilled' && catRes.value?.data?.data?.categories) {
        setBackendCategories(catRes.value.data.data.categories);
      }
      if (expRes.status === 'fulfilled' && Array.isArray(expRes.value?.data?.data)) {
        setExpenses(expRes.value.data.data);
      }
      if (incRes.status === 'fulfilled' && Array.isArray(incRes.value?.data?.data)) {
        setIncomes(incRes.value.data.data);
      }
    } catch (err) {
      console.warn('Category data fetch notice:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Handle Create Category
  const handleCreateCategory = async (catData) => {
    await api.post('/categories', catData);
    await fetchAllData();
  };

  // Handle Delete Category
  const handleDeleteCategory = async (cat) => {
    if (cat._id || cat.id) {
      const idToDelete = cat._id || cat.id;
      if (window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
        await api.delete(`/categories/${idToDelete}`);
        await fetchAllData();
      }
    }
  };

  // Filter expenses according to selected period
  const filteredExpenses = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();

    return expenses.filter((exp) => {
      if (!exp.date) return true;
      const d = new Date(exp.date);
      if (isNaN(d.getTime())) return true;
      const expYear = d.getFullYear();
      const expMonth = d.getMonth();

      if (selectedPeriod === 'This Month') return expYear === nowYear && expMonth === nowMonth;
      if (selectedPeriod === 'Last Month') {
        const lastMonth = nowMonth === 0 ? 11 : nowMonth - 1;
        const lastMonthYear = nowMonth === 0 ? nowYear - 1 : nowYear;
        return expYear === lastMonthYear && expMonth === lastMonth;
      }
      return true;
    });
  }, [expenses, selectedPeriod]);

  // Filter incomes according to selected period
  const filteredIncomes = useMemo(() => {
    if (!incomes || incomes.length === 0) return [];
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();

    return incomes.filter((inc) => {
      if (!inc.date) return true;
      const d = new Date(inc.date);
      if (isNaN(d.getTime())) return true;
      const incYear = d.getFullYear();
      const incMonth = d.getMonth();

      if (selectedPeriod === 'This Month') return incYear === nowYear && incMonth === nowMonth;
      if (selectedPeriod === 'Last Month') {
        const lastMonth = nowMonth === 0 ? 11 : nowMonth - 1;
        const lastMonthYear = nowMonth === 0 ? nowYear - 1 : nowYear;
        return incYear === lastMonthYear && incMonth === lastMonth;
      }
      return true;
    });
  }, [incomes, selectedPeriod]);

  // Enriched Categories with live amounts and percentages
  const enrichedCategories = useMemo(() => {
    const rawList = backendCategories.length > 0 ? backendCategories : INITIAL_CATEGORIES;
    const totalExp = filteredExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0) || 42350;
    const totalInc = filteredIncomes.reduce((s, i) => s + (Number(i.amount) || 0), 0) || 85000;

    // Map amounts from filtered records
    const expMap = {};
    filteredExpenses.forEach((e) => {
      const c = e.category || 'Other';
      expMap[c] = (expMap[c] || 0) + Number(e.amount || 0);
    });

    const incMap = {};
    filteredIncomes.forEach((i) => {
      const s = i.source || 'Other';
      incMap[s] = (incMap[s] || 0) + Number(i.amount || 0);
    });

    return rawList.map((cat) => {
      let amount = cat.amount;
      if (cat.type === 'Expense') {
        if (expMap[cat.name] !== undefined) amount = expMap[cat.name];
        else if (cat.name === 'Bills & Utilities' && expMap['Bills']) amount = expMap['Bills'];
        else if (cat.name === 'Health & Fitness' && expMap['Health']) amount = expMap['Health'];
      } else {
        if (incMap[cat.name] !== undefined) amount = incMap[cat.name];
      }

      const total = cat.type === 'Expense' ? totalExp : totalInc;
      const pct = total > 0 ? Math.round(((amount || 0) / total) * 100) : cat.percentage || 0;

      return {
        ...cat,
        amount: amount || cat.amount || 0,
        percentage: pct || cat.percentage || 0
      };
    });
  }, [backendCategories, filteredExpenses, filteredIncomes]);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalCount = enrichedCategories.length;
    const expenseCount = enrichedCategories.filter((c) => c.type === 'Expense').length;
    const incomeCount = enrichedCategories.filter((c) => c.type === 'Income').length;
    const customCount = enrichedCategories.filter((c) => c.isCustom).length || 3;

    const totalExp = filteredExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0) || 42350;

    // Find most used expense category
    const expenseCats = enrichedCategories.filter((c) => c.type === 'Expense');
    let topCat = expenseCats[0] || { name: 'Food & Dining', percentage: 28 };
    expenseCats.forEach((c) => {
      if ((c.amount || 0) > (topCat.amount || 0)) topCat = c;
    });

    return {
      totalCategories: totalCount,
      expenseCount,
      incomeCount,
      customCount,
      totalExpenses: totalExp,
      mostUsedCategory: topCat?.name || 'Food & Dining',
      mostUsedPercentage: topCat?.percentage || 28
    };
  }, [enrichedCategories, filteredExpenses]);

  // Recent Transactions Data
  const recentTransactionsData = useMemo(() => {
    if (filteredExpenses.length === 0) return null;
    return filteredExpenses.slice(0, 5).map((exp, idx) => ({
      id: exp._id || idx + 1,
      date: exp.date,
      description: exp.description || 'Expense',
      category: exp.category,
      amount: exp.amount,
      type: 'Expense'
    }));
  }, [filteredExpenses]);

  return (
    <div className="min-h-screen bg-[#0B1114] text-[#F1F5F4] flex">
      {/* 1. Sidebar (Categories active) */}
      <Sidebar
        activeItem="Categories"
        user={user}
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
          placeholder="Search categories, transactions, or tags..."
        />

        {/* Categories Workspace */}
        <main className="flex-1 px-4 sm:px-6 lg:px-7 py-5 space-y-5 max-w-[1536px] w-full mx-auto">
          {/* Header Row: Title & Date Range Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-[32px] font-bold text-[#F1F5F4] tracking-tight flex items-center gap-2.5">
                  Categories
                  <LayoutGrid className="w-6 h-6 text-[#35E9A0] stroke-[2.5]" />
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#71848A] mt-1">
                Organize your income and expenses with custom categories.
              </p>
            </div>

            {/* Date Range Selector Dropdown */}
            <div className="relative self-start sm:self-auto" ref={dateDropdownRef}>
              <button
                type="button"
                onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121E22] border border-[#24363B] text-xs font-medium text-[#F1F5F4] hover:border-[#35E9A0]/50 transition cursor-pointer shadow-xs"
              >
                <Calendar className="w-4 h-4 text-[#71848A]" />
                <span>{selectedPeriod}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#71848A] transition-transform duration-200 ${
                    dateDropdownOpen ? 'rotate-180 text-[#35E9A0]' : ''
                  }`}
                />
              </button>

              {dateDropdownOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-30 animate-in fade-in duration-100">
                  {['This Month', 'Last Month', 'This Year'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setSelectedPeriod(p);
                        setDateDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-xs text-left transition cursor-pointer ${
                        selectedPeriod === p
                          ? 'text-[#35E9A0] bg-[#15372F] font-semibold'
                          : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#203238]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. Four Financial Summary Cards */}
          <CategorySummaryCard
            totalCategories={summaryMetrics.totalCategories}
            expenseCategoriesCount={summaryMetrics.expenseCount}
            incomeCategoriesCount={summaryMetrics.incomeCount}
            totalExpenses={summaryMetrics.totalExpenses}
            activeExpenseCategoriesCount={summaryMetrics.expenseCount}
            mostUsedCategory={summaryMetrics.mostUsedCategory}
            mostUsedPercentage={summaryMetrics.mostUsedPercentage}
            customCategoriesCount={summaryMetrics.customCount}
          />

          {/* 4. Primary Content Row: All Categories (~70%) & Add New Category (~30%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left: All Categories */}
            <div className="lg:col-span-7 xl:col-span-8 h-full min-w-0">
              <CategoryGrid
                categories={enrichedCategories}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                searchQuery={catSearchQuery}
                onSearchChange={setCatSearchQuery}
                onDeleteCategory={handleDeleteCategory}
              />
            </div>

            {/* Right: Add New Category Form */}
            <div className="lg:col-span-5 xl:col-span-4 h-full min-w-0">
              <AddCategoryForm onCategoryCreated={handleCreateCategory} />
            </div>
          </div>

          {/* 5. Bottom Row: Category Spending Trend & Recent Transactions by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left: Category Spending Trend */}
            <div className="lg:col-span-5 h-full min-w-0">
              <CategorySpendingTrend
                selectedPeriod={trendPeriod}
                onPeriodChange={setTrendPeriod}
              />
            </div>

            {/* Right: Recent Transactions by Category */}
            <div className="lg:col-span-7 h-full min-w-0">
              <RecentCategoryTransactions
                transactions={recentTransactionsData}
                onViewAll={() => {
                  if (activeTab === 'Income') navigate('/transactions?type=Income');
                  else if (activeTab === 'Expense') navigate('/transactions?type=Expenses');
                  else navigate('/transactions');
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Categories;
