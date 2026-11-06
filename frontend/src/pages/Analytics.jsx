import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import AnalyticsSummaryCard from '../components/analytics/AnalyticsSummaryCard';
import IncomeExpenseTrendChart from '../components/analytics/IncomeExpenseTrendChart';
import SpendingBreakdownChart from '../components/analytics/SpendingBreakdownChart';
import MonthlySummaryHeatmap from '../components/analytics/MonthlySummaryHeatmap';
import CategoryTrendsChart from '../components/analytics/CategoryTrendsChart';
import IncomeSourcesChart from '../components/analytics/IncomeSourcesChart';
import ExpenseComparisonChart from '../components/analytics/ExpenseComparisonChart';
import FinancialInsights from '../components/analytics/FinancialInsights';
import { Calendar, ChevronDown, BarChart2 } from 'lucide-react';

export function Analytics() {
  const { user, logout } = useAuth();

  // Mobile sidebar state & search query
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Global Period Selector
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const dateDropdownRef = useRef(null);

  // Live Backend Data States
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  // Close global date dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target)) {
        setDateDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch all user expenses, income & AI insights
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      const [expRes, incRes, aiRes] = await Promise.allSettled([
        api.get('/expenses'),
        api.get('/income'),
        api.get('/ai/financial-insights')
      ]);

      if (expRes.status === 'fulfilled' && Array.isArray(expRes.value?.data?.data)) {
        setExpenses(expRes.value.data.data);
      }
      if (incRes.status === 'fulfilled' && Array.isArray(incRes.value?.data?.data)) {
        setIncomes(incRes.value.data.data);
      }
      if (aiRes.status === 'fulfilled' && aiRes.value?.data?.data) {
        setAiInsights(aiRes.value.data.data);
      }
    } catch (err) {
      console.warn('Analytics data fetch notice:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Filter expenses according to selected global period
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

  // Filter incomes according to selected global period
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

      if (selectedPeriod === 'This Month') {
        return incYear === nowYear && incMonth === nowMonth;
      }
      if (selectedPeriod === 'Last Month') {
        const lastMonth = nowMonth === 0 ? 11 : nowMonth - 1;
        const lastMonthYear = nowMonth === 0 ? nowYear - 1 : nowYear;
        return incYear === lastMonthYear && incMonth === lastMonth;
      }
      if (selectedPeriod === 'This Year') {
        return incYear === nowYear;
      }
      return true;
    });
  }, [incomes, selectedPeriod]);

  // 1. Four Financial Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalAllIncomes = incomes.reduce((s, i) => s + (Number(i.amount) || 0), 0);
    const totalAllExpenses = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);

    // Cumulative balance: total income minus total expenses
    const liveBalance = totalAllIncomes - totalAllExpenses;

    const periodInc = filteredIncomes.reduce((s, i) => s + (Number(i.amount) || 0), 0);
    const periodExp = filteredExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const periodSavings = periodInc - periodExp;

    return {
      totalBalance: liveBalance,
      totalIncome: periodInc,
      totalExpenses: periodExp,
      totalSavings: periodSavings,
      balanceChange: '+0.0%',
      incomeChange: '+0.0%',
      expenseChange: '+0.0%',
      savingsChange: '+0.0%'
    };
  }, [incomes, expenses, filteredIncomes, filteredExpenses]);

  // 2. Income vs Expenses Trend (12 Months Composed Chart)
  const monthlyTrendsData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const nowYear = new Date().getFullYear();
    const incMap = Array(12).fill(0);
    const expMap = Array(12).fill(0);

    incomes.forEach((inc) => {
      if (inc.date) {
        const d = new Date(inc.date);
        if (!isNaN(d.getTime()) && d.getFullYear() === nowYear) {
          incMap[d.getMonth()] += Number(inc.amount || 0);
        }
      }
    });

    expenses.forEach((exp) => {
      if (exp.date) {
        const d = new Date(exp.date);
        if (!isNaN(d.getTime()) && d.getFullYear() === nowYear) {
          expMap[d.getMonth()] += Number(exp.amount || 0);
        }
      }
    });

    return months.map((month, idx) => {
      const inc = incMap[idx] || 0;
      const exp = expMap[idx] || 0;
      return {
        month,
        income: inc,
        expenses: exp,
        balance: Math.max(0, inc - exp)
      };
    });
  }, [incomes, expenses]);

  // 3. Spending Breakdown (Donut Chart)
  const spendingBreakdownData = useMemo(() => {
    if (filteredExpenses.length === 0) return [];

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

  // 4. Monthly Summary Heatmap Data
  const monthlyHeatmapData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const nowYear = new Date().getFullYear();
    const incTotals = Array(12).fill(0);
    const expTotals = Array(12).fill(0);

    incomes.forEach((i) => {
      if (i.date) {
        const d = new Date(i.date);
        if (!isNaN(d.getTime()) && d.getFullYear() === nowYear) incTotals[d.getMonth()] += Number(i.amount || 0);
      }
    });

    expenses.forEach((e) => {
      if (e.date) {
        const d = new Date(e.date);
        if (!isNaN(d.getTime()) && d.getFullYear() === nowYear) expTotals[d.getMonth()] += Number(e.amount || 0);
      }
    });

    const maxExp = Math.max(...expTotals, 1);
    const maxInc = Math.max(...incTotals, 1);

    const expList = months.map((m, idx) => {
      const amt = expTotals[idx];
      const ratio = amt / maxExp;
      const level = amt === 0 ? 0 : ratio > 0.75 ? 4 : ratio > 0.5 ? 3 : ratio > 0.25 ? 2 : 1;
      return { month: m, amount: amt, level };
    });

    const incList = months.map((m, idx) => {
      const amt = incTotals[idx];
      const ratio = amt / maxInc;
      const level = amt === 0 ? 0 : ratio > 0.75 ? 4 : ratio > 0.5 ? 3 : ratio > 0.25 ? 2 : 1;
      return { month: m, amount: amt, level };
    });

    const savList = months.map((m, idx) => {
      const amt = Math.max(0, incTotals[idx] - expTotals[idx]);
      const level = amt === 0 ? 0 : amt > 20000 ? 4 : amt > 14000 ? 3 : amt > 8000 ? 2 : 1;
      return { month: m, amount: amt, level };
    });

    return {
      expenses: expList,
      income: incList,
      savings: savList
    };
  }, [incomes, expenses]);

  // 5. Category Trends (Last 6 Months Area Chart)
  const categoryTrendsData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const last6 = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6.push({
        month: monthNames[d.getMonth()],
        year: d.getFullYear(),
        monthIndex: d.getMonth()
      });
    }

    const categories = ['Food & Dining', 'Shopping', 'Transport', 'Bills', 'Others'];
    const result = {
      'Food & Dining': [],
      Shopping: [],
      Transport: [],
      Bills: [],
      Others: []
    };

    last6.forEach(({ month, year, monthIndex }) => {
      const monthExpenses = expenses.filter((e) => {
        if (!e.date) return false;
        const d = new Date(e.date);
        return !isNaN(d.getTime()) && d.getFullYear() === year && d.getMonth() === monthIndex;
      });

      const catSum = {
        'Food & Dining': 0,
        Shopping: 0,
        Transport: 0,
        Bills: 0,
        Others: 0
      };

      monthExpenses.forEach((e) => {
        const c = e.category || 'Other';
        if (c === 'Food') catSum['Food & Dining'] += Number(e.amount || 0);
        else if (c === 'Shopping') catSum.Shopping += Number(e.amount || 0);
        else if (c === 'Transport') catSum.Transport += Number(e.amount || 0);
        else if (c === 'Bills') catSum.Bills += Number(e.amount || 0);
        else catSum.Others += Number(e.amount || 0);
      });

      categories.forEach((cat) => {
        result[cat].push({ month, amount: catSum[cat] });
      });
    });

    return result;
  }, [expenses]);

  // 6. Income Sources (Donut Chart)
  const incomeSourcesData = useMemo(() => {
    if (filteredIncomes.length === 0) return [];

    const sourceMap = {};
    filteredIncomes.forEach((inc) => {
      const src = inc.source || 'Other';
      sourceMap[src] = (sourceMap[src] || 0) + Number(inc.amount || 0);
    });

    const total = Object.values(sourceMap).reduce((s, v) => s + v, 0);

    const colors = {
      Salary: '#35E9A0',
      Freelance: '#B18AFF',
      Investment: '#45B7F5',
      Business: '#FF8A48',
      Rental: '#F6C85F',
      Other: '#20D6C7'
    };

    return Object.keys(sourceMap).map((src) => ({
      name: src === 'Business' ? 'Side Income' : src,
      value: sourceMap[src],
      percentage: total > 0 ? Math.round((sourceMap[src] / total) * 100) : 0,
      color: colors[src] || '#20D6C7'
    }));
  }, [filteredIncomes]);

  // 7. Expense Comparison (Last 3 Months Grouped Bars)
  const comparisonData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const last3 = [];

    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIdx = d.getMonth();
      const yr = d.getFullYear();
      const mName = monthNames[mIdx];

      const incTotal = incomes
        .filter((inc) => {
          if (!inc.date) return false;
          const dt = new Date(inc.date);
          return !isNaN(dt.getTime()) && dt.getFullYear() === yr && dt.getMonth() === mIdx;
        })
        .reduce((s, i) => s + Number(i.amount || 0), 0);

      const expTotal = expenses
        .filter((exp) => {
          if (!exp.date) return false;
          const dt = new Date(exp.date);
          return !isNaN(dt.getTime()) && dt.getFullYear() === yr && dt.getMonth() === mIdx;
        })
        .reduce((s, e) => s + Number(e.amount || 0), 0);

      last3.push({
        month: mName,
        income: incTotal,
        expenses: expTotal
      });
    }

    return last3;
  }, [incomes, expenses]);

  return (
    <div className="min-h-screen bg-[#0B1114] text-[#F1F5F4] flex">
      {/* 1. Sidebar (Analytics active) */}
      <Sidebar
        activeItem="Analytics"
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
          placeholder="Search transactions, categories, or insights..."
        />

        {/* Analytics Workspace */}
        <main className="flex-1 px-4 sm:px-6 lg:px-7 py-5 space-y-5 max-w-[1536px] w-full mx-auto">
          {/* Header Row: Title & Date Range Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-[32px] font-bold text-[#F1F5F4] tracking-tight flex items-center gap-2.5">
                  Analytics
                  <BarChart2 className="w-6 h-6 text-[#35E9A0] stroke-[2.5]" />
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#71848A] mt-1">
                Get detailed insights into your financial behaviour and track your progress.
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
          <AnalyticsSummaryCard
            totalBalance={summaryMetrics.totalBalance}
            totalIncome={summaryMetrics.totalIncome}
            totalExpenses={summaryMetrics.totalExpenses}
            totalSavings={summaryMetrics.totalSavings}
            balanceChange={summaryMetrics.balanceChange}
            incomeChange={summaryMetrics.incomeChange}
            expenseChange={summaryMetrics.expenseChange}
            savingsChange={summaryMetrics.savingsChange}
          />

          {/* 4. Chart Row 1: Income vs Expenses Trend (~60%) & Spending Breakdown (~40%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left: Income vs Expenses Trend */}
            <div className="lg:col-span-7 h-full min-w-0">
              <IncomeExpenseTrendChart
                data={monthlyTrendsData}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>

            {/* Right: Spending Breakdown */}
            <div className="lg:col-span-5 h-full min-w-0">
              <SpendingBreakdownChart
                categories={spendingBreakdownData}
                totalExpenses={summaryMetrics.totalExpenses}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>
          </div>

          {/* 5. Chart Row 2: Monthly Summary Heatmap & Category Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left: Monthly Summary Heatmap */}
            <div className="lg:col-span-5 h-full min-w-0">
              <MonthlySummaryHeatmap
                data={monthlyHeatmapData}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>

            {/* Right: Category Trends Area Chart */}
            <div className="lg:col-span-7 h-full min-w-0">
              <CategoryTrendsChart
                categoryData={categoryTrendsData}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>
          </div>

          {/* 6. Chart Row 3: Income Sources, Expense Comparison, Financial Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5 items-stretch">
            {/* Left: Income Sources */}
            <div className="xl:col-span-4 h-full min-w-0">
              <IncomeSourcesChart
                sources={incomeSourcesData}
                totalIncome={summaryMetrics.totalIncome}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>

            {/* Center: Expense Comparison */}
            <div className="xl:col-span-4 h-full min-w-0">
              <ExpenseComparisonChart
                data={comparisonData}
                selectedPeriod="Last 3 Months"
              />
            </div>

            {/* Right: Financial Insights */}
            <div className="md:col-span-2 xl:col-span-4 h-full min-w-0">
              <FinancialInsights />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Analytics;
