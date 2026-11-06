import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import SummaryCard from '../components/dashboard/SummaryCard';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import SpendingCategoryChart from '../components/dashboard/SpendingCategoryChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import AIInsights from '../components/dashboard/AIInsights';
import BudgetProgress from '../components/dashboard/BudgetProgress';
import QuickActions from '../components/dashboard/QuickActions';
import FinancialGoals from '../components/dashboard/FinancialGoals';
import {
  AddExpenseModal,
  AddIncomeModal,
  SetBudgetModal
} from '../components/dashboard/TransactionModals';
import { Calendar, ChevronDown } from 'lucide-react';
import { compareLatestFirst } from '../utils/formatters';

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Mobile sidebar drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Dashboard');

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Selected date filter
  const [selectedDateRange, setSelectedDateRange] = useState('This Month');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const dateDropdownRef = useRef(null);

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

  // Modals state for Quick Actions
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [addIncomeOpen, setAddIncomeOpen] = useState(false);
  const [setBudgetOpen, setSetBudgetOpen] = useState(false);

  // Live Backend Data States
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgetList, setBudgetList] = useState([]);
  const [goalsList, setGoalsList] = useState([]);

  // Parse current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Data fetching handler - fetch strictly from database
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [
        expensesRes,
        incomeRes,
        budgetRes,
        goalsRes
      ] = await Promise.allSettled([
        api.get('/expenses'),
        api.get('/income'),
        api.get('/budget'),
        api.get('/goals')
      ]);

      const rawExpenses =
        expensesRes.status === 'fulfilled' && Array.isArray(expensesRes.value.data?.data)
          ? expensesRes.value.data.data
          : [];
      setExpenses(rawExpenses);

      const rawIncomes =
        incomeRes.status === 'fulfilled' && Array.isArray(incomeRes.value.data?.data)
          ? incomeRes.value.data.data
          : [];
      setIncomes(rawIncomes);

      const allExpenses = rawExpenses.map((item) => ({ ...item, type: 'expense' }));
      const allIncomes = rawIncomes.map((item) => ({
        ...item,
        type: 'income',
        name: item.source || item.description || 'Income',
        category: item.source || item.category || 'Income',
        description: item.description || item.source || 'Income'
      }));

      const mergedTransactions = [...allExpenses, ...allIncomes].sort(compareLatestFirst);
      setTransactions(mergedTransactions);

      if (budgetRes.status === 'fulfilled' && Array.isArray(budgetRes.value.data?.data)) {
        setBudgetList(budgetRes.value.data.data);
      } else {
        setBudgetList([]);
      }

      if (goalsRes.status === 'fulfilled' && Array.isArray(goalsRes.value.data?.data)) {
        setGoalsList(goalsRes.value.data.data);
      } else {
        setGoalsList([]);
      }
    } catch (err) {
      console.warn('Dashboard fetch notice:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Authenticated user greeting name with proper capitalization
  const rawName = user?.name ? user.name.split(' ')[0] : 'User';
  const userName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  // Filter transactions based on selected date range
  const filteredData = useMemo(() => {
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();

    const filterByDate = (items) => {
      if (selectedDateRange === 'All Time') return items;
      return items.filter((item) => {
        if (!item.date) return true;
        const d = new Date(item.date);
        if (isNaN(d.getTime())) return true;
        const y = d.getFullYear();
        const m = d.getMonth();

        if (selectedDateRange === 'This Month') {
          return y === nowYear && m === nowMonth;
        }
        if (selectedDateRange === 'Last Month') {
          const lastMonth = nowMonth === 0 ? 11 : nowMonth - 1;
          const lastYear = nowMonth === 0 ? nowYear - 1 : nowYear;
          return y === lastYear && m === lastMonth;
        }
        if (selectedDateRange === 'This Year') {
          return y === nowYear;
        }
        return true;
      });
    };

    const periodExpenses = filterByDate(expenses);
    const periodIncomes = filterByDate(incomes);

    const totalIncome = periodIncomes.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalExpenses = periodExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalAllIncomes = incomes.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalAllExpenses = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const cumulativeBalance = totalAllIncomes - totalAllExpenses;

    const totalBudget = budgetList.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

    return {
      periodExpenses,
      periodIncomes,
      totalIncome,
      totalExpenses,
      cumulativeBalance,
      totalBudget
    };
  }, [expenses, incomes, budgetList, selectedDateRange]);

  // Dynamic summary metrics based strictly on database records
  const metrics = useMemo(() => {
    return {
      balance: filteredData.cumulativeBalance,
      income: filteredData.totalIncome,
      expenses: filteredData.totalExpenses,
      spent: filteredData.totalExpenses,
      budget: filteredData.totalBudget,
      balanceChange: transactions.length > 0 ? '+100%' : '0%',
      incomeChange: filteredData.periodIncomes.length > 0 ? '+100%' : '0%',
      expenseChange: filteredData.periodExpenses.length > 0 ? '+100%' : '0%'
    };
  }, [filteredData, transactions.length]);

  // Dynamic Category Breakdown computed from real expenses
  const categoriesData = useMemo(() => {
    if (filteredData.periodExpenses.length === 0) return [];

    const catMap = {};
    filteredData.periodExpenses.forEach((exp) => {
      const cat = exp.category || 'Other';
      catMap[cat] = (catMap[cat] || 0) + (Number(exp.amount) || 0);
    });

    const totalAmount = Object.values(catMap).reduce((s, v) => s + v, 0);
    const colorPalette = [
      '#FF667A',
      '#FF8A48',
      '#F6C85F',
      '#20D6C7',
      '#45B7F5',
      '#FF6EA7',
      '#B18AFF'
    ];

    return Object.entries(catMap).map(([name, value], idx) => ({
      name,
      value,
      percentage: totalAmount > 0 ? Math.round((value / totalAmount) * 100) : 0,
      color: colorPalette[idx % colorPalette.length]
    }));
  }, [filteredData.periodExpenses]);

  // Dynamic Monthly Trends computed from real database data for the current year
  const trendData = useMemo(() => {
    const monthsNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const expMap = Array(12).fill(0);
    const incMap = Array(12).fill(0);

    expenses.forEach((exp) => {
      if (exp.date) {
        const d = new Date(exp.date);
        if (!isNaN(d.getTime()) && d.getFullYear() === currentYear) {
          expMap[d.getMonth()] += Number(exp.amount || 0);
        }
      }
    });

    incomes.forEach((inc) => {
      if (inc.date) {
        const d = new Date(inc.date);
        if (!isNaN(d.getTime()) && d.getFullYear() === currentYear) {
          incMap[d.getMonth()] += Number(inc.amount || 0);
        }
      }
    });

    return monthsNames.map((name, i) => ({
      month: name,
      expenses: expMap[i],
      income: incMap[i]
    }));
  }, [expenses, incomes, currentYear]);

  return (
    <div className="min-h-screen bg-[#0B1114] text-[#F1F5F4] flex">
      {/* 1. Left Sidebar */}
      <Sidebar
        activeItem={activeNav}
        onNavigate={(item) => setActiveNav(item.id)}
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
        />

        {/* Dashboard Main Workspace */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1600px] w-full mx-auto">
          {/* Greeting & Date Filter Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#F1F5F4] tracking-tight">
                Hello, {userName} 👋
              </h1>
              <p className="text-xs sm:text-sm text-[#A5B4B8] mt-0.5">
                Here's your financial overview for {selectedDateRange.toLowerCase()}.
              </p>
            </div>

            {/* Date Range Selector Dropdown */}
            <div className="relative self-start sm:self-auto" ref={dateDropdownRef}>
              <button
                type="button"
                onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121E22] border border-[#24363B] text-xs text-[#F1F5F4] hover:border-[#35E9A0]/50 transition cursor-pointer shadow-xs"
              >
                <Calendar className="w-4 h-4 text-[#A5B4B8]" />
                <span className="font-medium">{selectedDateRange}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#71848A] transition-transform duration-200 ${
                    dateDropdownOpen ? 'rotate-180 text-[#35E9A0]' : ''
                  }`}
                />
              </button>

              {dateDropdownOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {['This Month', 'Last Month', 'This Year', 'All Time'].map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => {
                        setSelectedDateRange(range);
                        setDateDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-xs text-left transition cursor-pointer ${
                        selectedDateRange === range
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

          {/* 3. Row of 4 Financial Summary Cards */}
          <SummaryCard
            totalBalance={metrics.balance}
            totalIncome={metrics.income}
            totalExpenses={metrics.expenses}
            totalSpent={metrics.spent}
            budgetAmount={metrics.budget}
            balanceChange={metrics.balanceChange}
            incomeChange={metrics.incomeChange}
            expenseChange={metrics.expenseChange}
          />

          {/* 4. Middle Row: 2 Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            {/* Left 60%: Income vs Expense Chart */}
            <div className="lg:col-span-7">
              <IncomeExpenseChart
                data={trendData}
                selectedPeriod="This Year"
              />
            </div>

            {/* Right 40%: Spending by Category Donut Chart */}
            <div className="lg:col-span-5">
              <SpendingCategoryChart
                categories={categoriesData}
                totalSpent={metrics.spent}
                selectedPeriod={selectedDateRange}
              />
            </div>
          </div>

          {/* 5. Second Row: Recent Transactions + AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {/* Left 50%: Recent Transactions */}
            <RecentTransactions
              transactions={transactions}
              searchQuery={searchQuery}
              onViewAll={() => navigate('/transactions')}
              onAddTransaction={() => setAddExpenseOpen(true)}
            />

            {/* Right 50%: AI Financial Insights */}
            <AIInsights
              totalIncome={metrics.income}
              totalExpenses={metrics.expenses}
              transactionCount={transactions.length}
              onViewAll={() => navigate('/ai-insights')}
            />
          </div>

          {/* 6. Bottom Row: Three Compact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 pb-6">
            {/* Card A: Monthly Budget Progress */}
            <div className="lg:col-span-4">
              <BudgetProgress
                budgets={budgetList}
                expenses={expenses}
                onViewAll={() => navigate('/budgets')}
                onSetBudget={() => setSetBudgetOpen(true)}
              />
            </div>

            {/* Card B: Quick Actions */}
            <div className="lg:col-span-4">
              <QuickActions
                onAddExpense={() => setAddExpenseOpen(true)}
                onAddIncome={() => setAddIncomeOpen(true)}
                onSetBudget={() => setSetBudgetOpen(true)}
                onViewReports={() => navigate('/analytics')}
              />
            </div>

            {/* Card C: Financial Goals */}
            <div className="lg:col-span-4 md:col-span-2">
              <FinancialGoals
                goals={goalsList}
                onViewAll={() => navigate('/goals')}
                onAddGoal={() => navigate('/goals')}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Interactive Quick Action Modals */}
      <AddExpenseModal
        isOpen={addExpenseOpen}
        onClose={() => setAddExpenseOpen(false)}
        onSuccess={fetchDashboardData}
      />

      <AddIncomeModal
        isOpen={addIncomeOpen}
        onClose={() => setAddIncomeOpen(false)}
        onSuccess={fetchDashboardData}
      />

      <SetBudgetModal
        isOpen={setBudgetOpen}
        onClose={() => setSetBudgetOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
}

export default Dashboard;
