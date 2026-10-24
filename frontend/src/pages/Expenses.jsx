import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import ExpenseSummaryCard from '../components/expenses/ExpenseSummaryCard';
import ExpenseTrendChart from '../components/expenses/ExpenseTrendChart';
import ExpenseCategoryChart from '../components/expenses/ExpenseCategoryChart';
import AddExpenseForm from '../components/expenses/AddExpenseForm';
import RecentExpensesTable from '../components/expenses/RecentExpensesTable';
import ExpenseInsights from '../components/expenses/ExpenseInsights';
import TopMerchants from '../components/expenses/TopMerchants';
import ExpenseBreakdownChart from '../components/expenses/ExpenseBreakdownChart';
import CategoryLimits from '../components/expenses/CategoryLimits';
import EditExpenseModal from '../components/expenses/EditExpenseModal';
import DeleteExpenseModal from '../components/expenses/DeleteExpenseModal';
import { Calendar, ChevronDown, TrendingDown } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export function Expenses() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Mobile sidebar state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Reporting Period
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const dateDropdownRef = useRef(null);

  // Live Backend Data States
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);

  // Close date dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target)) {
        setDateDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch all user expenses & budgets
  const fetchExpenseData = useCallback(async () => {
    try {
      setLoading(true);
      const [expensesRes, budgetsRes] = await Promise.allSettled([
        api.get('/expenses'),
        api.get('/budget')
      ]);

      if (expensesRes.status === 'fulfilled' && Array.isArray(expensesRes.value?.data?.data)) {
        setExpenses(expensesRes.value.data.data);
      }
      if (budgetsRes.status === 'fulfilled' && Array.isArray(budgetsRes.value?.data?.data)) {
        setBudgets(budgetsRes.value.data.data);
      }
    } catch (err) {
      console.warn('Expense fetch notice:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenseData();
  }, [fetchExpenseData]);

  // Filter expenses according to selected period
  const filteredExpenses = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const now = new Date(); // In this environment: Oct 2026
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();

    return expenses.filter((exp) => {
      if (!exp.date) return true;
      const d = new Date(exp.date);
      if (isNaN(d.getTime())) return true;

      const expYear = d.getFullYear();
      const expMonth = d.getMonth();

      if (selectedPeriod === 'This Month') {
        return expYear === nowYear && expMonth === nowMonth;
      }
      if (selectedPeriod === 'Last Month') {
        const lastMonth = nowMonth === 0 ? 11 : nowMonth - 1;
        const lastMonthYear = nowMonth === 0 ? nowYear - 1 : nowYear;
        return expYear === lastMonthYear && expMonth === lastMonth;
      }
      if (selectedPeriod === 'This Year') {
        return expYear === nowYear;
      }
      return true;
    });
  }, [expenses, selectedPeriod]);

  // Search filtered expenses if user enters search in top bar
  const displayExpenses = useMemo(() => {
    if (!searchQuery.trim()) return filteredExpenses;
    const q = searchQuery.toLowerCase().trim();
    return filteredExpenses.filter((e) => {
      const descMatch = (e.description || '').toLowerCase().includes(q);
      const catMatch = (e.category || '').toLowerCase().includes(q);
      return descMatch || catMatch;
    });
  }, [filteredExpenses, searchQuery]);

  // Derived Summary Metrics
  const summaryMetrics = useMemo(() => {
    if (filteredExpenses.length > 0) {
      const total = filteredExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      const count = filteredExpenses.length;
      const avg = count > 0 ? Math.round(total / count) : 0;

      let highest = filteredExpenses[0];
      filteredExpenses.forEach((item) => {
        if (Number(item.amount) > Number(highest.amount)) {
          highest = item;
        }
      });

      return {
        totalExpenses: total,
        totalTransactions: count,
        averageExpense: avg,
        highestExpense: Number(highest?.amount) || 0,
        highestMerchant: highest?.description || highest?.category || 'Expense',
        highestDate: highest?.date ? formatDate(highest.date) : 'Recently',
        expenseChange: '+12.5%',
        transactionsChange: '+4'
      };
    }

    if (selectedPeriod === 'Last Month') {
      return {
        totalExpenses: 38900,
        totalTransactions: 24,
        averageExpense: 1620,
        highestExpense: 4200,
        highestMerchant: 'Amazon',
        highestDate: 'Sep 22, 2026',
        expenseChange: '+8.4%',
        transactionsChange: '+2'
      };
    }

    if (selectedPeriod === 'This Year') {
      return {
        totalExpenses: 318500,
        totalTransactions: 186,
        averageExpense: 1712,
        highestExpense: 12500,
        highestMerchant: 'Flight Booking',
        highestDate: 'Jun 14, 2026',
        expenseChange: '+15.2%',
        transactionsChange: '+28'
      };
    }

    // Default 'This Month' reference metrics
    return {
      totalExpenses: 42350,
      totalTransactions: 28,
      averageExpense: 1512,
      highestExpense: 4850,
      highestMerchant: 'Amazon',
      highestDate: 'Oct 18, 2026',
      expenseChange: '+12.5%',
      transactionsChange: '+4'
    };
  }, [filteredExpenses, selectedPeriod]);

  // Dynamic Category Breakdown for Donut Chart
  const categoryChartData = useMemo(() => {
    if (filteredExpenses.length === 0) return null;

    const catMap = {};
    filteredExpenses.forEach((exp) => {
      const cat = exp.category || 'Other';
      catMap[cat] = (catMap[cat] || 0) + Number(exp.amount || 0);
    });

    const total = Object.values(catMap).reduce((s, v) => s + v, 0);

    const colorMap = {
      Food: '#FF667A',
      Shopping: '#FF8A48',
      Transport: '#F6C85F',
      Bills: '#20D6C7',
      Entertainment: '#45B7F5',
      Health: '#FF6EA7',
      Other: '#B18AFF'
    };

    const labelMap = {
      Food: 'Food & Dining',
      Shopping: 'Shopping',
      Transport: 'Transport',
      Bills: 'Bills & Utilities',
      Entertainment: 'Entertainment',
      Health: 'Health & Fitness',
      Other: 'Others'
    };

    return Object.keys(catMap).map((cat) => ({
      name: labelMap[cat] || cat,
      value: catMap[cat],
      percentage: total > 0 ? Math.round((catMap[cat] / total) * 100) : 0,
      color: colorMap[cat] || '#B18AFF'
    }));
  }, [filteredExpenses]);

  // Dynamic Monthly Trends for Bar Chart
  const monthlyTrendsData = useMemo(() => {
    if (expenses.length === 0) return null;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthTotals = Array(12).fill(0);

    expenses.forEach((exp) => {
      if (exp.date) {
        const d = new Date(exp.date);
        if (!isNaN(d.getTime())) {
          const m = d.getMonth();
          monthTotals[m] += Number(exp.amount || 0);
        }
      }
    });

    return months.map((month, idx) => ({
      month,
      amount: monthTotals[idx]
    }));
  }, [expenses]);

  // Dynamic Top Merchants
  const topMerchantsData = useMemo(() => {
    if (filteredExpenses.length === 0) return null;

    const merchantMap = {};
    filteredExpenses.forEach((exp) => {
      const name = exp.description || exp.category || 'Merchant';
      if (!merchantMap[name]) {
        merchantMap[name] = { name, amount: 0, transactions: 0, category: exp.category };
      }
      merchantMap[name].amount += Number(exp.amount || 0);
      merchantMap[name].transactions += 1;
    });

    const sorted = Object.values(merchantMap).sort((a, b) => b.amount - a.amount).slice(0, 5);
    const totalSpent = filteredExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);

    const colors = ['#FF667A', '#B18AFF', '#20D6C7', '#45B7F5', '#F6C85F'];

    return sorted.map((m, idx) => ({
      id: `merchant-${idx}`,
      name: m.name,
      amount: m.amount,
      transactions: m.transactions,
      percentage: totalSpent > 0 ? Math.round((m.amount / totalSpent) * 100) : 0,
      barColor: colors[idx % colors.length]
    }));
  }, [filteredExpenses]);

  // Dynamic Category Limits (combining budgets with actual expenses)
  const categoryLimitsData = useMemo(() => {
    if (budgets.length === 0 || expenses.length === 0) return null;

    const spendMap = {};
    filteredExpenses.forEach((exp) => {
      spendMap[exp.category] = (spendMap[exp.category] || 0) + Number(exp.amount || 0);
    });

    const colors = ['#FF667A', '#B18AFF', '#20D6C7', '#F6C85F'];
    const labelMap = {
      Food: 'Food & Dining',
      Shopping: 'Shopping',
      Transport: 'Transport',
      Bills: 'Bills & Utilities',
      Entertainment: 'Entertainment',
      Health: 'Health & Fitness',
      Investment: 'Investment',
      Other: 'Others'
    };

    return budgets.slice(0, 4).map((b, idx) => {
      const spent = spendMap[b.category] || 0;
      const limit = Number(b.amount) || 1;
      const pct = Math.min(100, Math.round((spent / limit) * 100));

      return {
        id: b._id,
        name: labelMap[b.category] || b.name || b.category,
        spent,
        limit,
        percentage: pct,
        barColor: colors[idx % colors.length]
      };
    });
  }, [budgets, filteredExpenses]);

  return (
    <div className="min-h-screen bg-[#0B1114] text-[#F1F5F4] flex">
      {/* 1. Sidebar (Expenses active) */}
      <Sidebar
        activeItem="Expenses"
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
          placeholder="Search expenses, categories, or merchants..."
        />

        {/* Expenses Main Workspace */}
        <main className="flex-1 px-4 sm:px-6 lg:px-7 py-5 space-y-5 max-w-[1536px] w-full mx-auto">
          {/* Header Row: Title & Date Range Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-[32px] font-bold text-[#F1F5F4] tracking-tight flex items-center gap-2">
                  Expenses
                  <TrendingDown className="w-6 h-6 text-[#FF667A] stroke-[2.5]" />
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#71848A] mt-1">
                Track and manage your expenses to build better spending habits.
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
                <div className="absolute right-0 mt-1 w-36 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
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

          {/* 3. Four Expense Summary Cards */}
          <ExpenseSummaryCard
            totalExpenses={summaryMetrics.totalExpenses}
            totalTransactions={summaryMetrics.totalTransactions}
            averageExpense={summaryMetrics.averageExpense}
            highestExpense={summaryMetrics.highestExpense}
            highestMerchant={summaryMetrics.highestMerchant}
            highestDate={summaryMetrics.highestDate}
            expenseChange={summaryMetrics.expenseChange}
            transactionsChange={summaryMetrics.transactionsChange}
          />

          {/* 4. Main Row 1: Expenses Trend, Expenses by Category, Add New Expense */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left: Expenses Trend */}
            <div className="lg:col-span-7 xl:col-span-5 h-full min-w-0">
              <ExpenseTrendChart
                data={monthlyTrendsData}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>

            {/* Center: Expenses by Category */}
            <div className="lg:col-span-5 xl:col-span-4 h-full min-w-0">
              <ExpenseCategoryChart
                categories={categoryChartData}
                totalExpenses={summaryMetrics.totalExpenses}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>

            {/* Right: Add New Expense Form */}
            <div className="lg:col-span-12 xl:col-span-3 h-full min-w-0">
              <AddExpenseForm onSuccess={fetchExpenseData} />
            </div>
          </div>

          {/* 5. Main Row 2: Recent Expenses & Expense Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left: Recent Expenses */}
            <div className="lg:col-span-7 h-full min-w-0">
              <RecentExpensesTable
                expenses={displayExpenses}
                loading={loading}
                onEdit={(exp) => setEditingExpense(exp)}
                onDelete={(exp) => setDeletingExpense(exp)}
                onViewAll={() => navigate('/transactions?type=Expenses')}
              />
            </div>

            {/* Right: Expense Insights */}
            <div className="lg:col-span-5 h-full min-w-0">
              <ExpenseInsights />
            </div>
          </div>

          {/* 6. Main Row 3: Top Merchants, Expense Breakdown, Category Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5 items-stretch">
            {/* Left: Top Merchants */}
            <div className="xl:col-span-4 h-full min-w-0">
              <TopMerchants
                merchants={topMerchantsData}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>

            {/* Center: Expense Breakdown */}
            <div className="xl:col-span-4 h-full min-w-0">
              <ExpenseBreakdownChart />
            </div>

            {/* Right: Category Limits */}
            <div className="md:col-span-2 xl:col-span-4 h-full min-w-0">
              <CategoryLimits limits={categoryLimitsData} />
            </div>
          </div>
        </main>
      </div>

      {/* Edit Expense Modal */}
      <EditExpenseModal
        expense={editingExpense}
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        onSuccess={fetchExpenseData}
      />

      {/* Delete Expense Confirmation Modal */}
      <DeleteExpenseModal
        expense={deletingExpense}
        isOpen={!!deletingExpense}
        onClose={() => setDeletingExpense(null)}
        onSuccess={fetchExpenseData}
      />
    </div>
  );
}

export default Expenses;
