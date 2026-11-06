import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import IncomeSummaryCard from '../components/income/IncomeSummaryCard';
import MonthlyIncomeChart from '../components/income/MonthlyIncomeChart';
import AddIncomeForm from '../components/income/AddIncomeForm';
import RecentIncomeTable from '../components/income/RecentIncomeTable';
import IncomeCategoryChart from '../components/income/IncomeCategoryChart';
import IncomeInsights from '../components/income/IncomeInsights';
import EditIncomeModal from '../components/income/EditIncomeModal';
import { TrendingUp, Calendar, ChevronDown } from 'lucide-react';
import { formatDate, compareLatestFirst } from '../utils/formatters';

export function Income() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Mobile sidebar state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Date Range selector
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const dateDropdownRef = useRef(null);

  // Edit Modal state
  const [editingIncome, setEditingIncome] = useState(null);

  // Live Backend Data States
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target)) {
        setDateDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch authenticated user's income records
  const fetchIncomeData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/income');
      if (res.data?.data && Array.isArray(res.data.data)) {
        setIncomes([...res.data.data].sort(compareLatestFirst));
      }
    } catch (err) {
      console.warn('Income fetch notice:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomeData();
  }, [fetchIncomeData]);

  // Filter incomes according to selected period
  const filteredIncomes = useMemo(() => {
    if (!incomes || incomes.length === 0) return [];
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();

    return incomes.filter((item) => {
      if (!item.date) return true;
      const d = new Date(item.date);
      if (isNaN(d.getTime())) return true;
      const itemYear = d.getFullYear();
      const itemMonth = d.getMonth();

      if (selectedPeriod === 'This Month') {
        return itemYear === nowYear && itemMonth === nowMonth;
      }
      if (selectedPeriod === 'Last Month') {
        const lastMonth = nowMonth === 0 ? 11 : nowMonth - 1;
        const lastMonthYear = nowMonth === 0 ? nowYear - 1 : nowYear;
        return itemYear === lastMonthYear && itemMonth === lastMonth;
      }
      if (selectedPeriod === 'This Year') {
        return itemYear === nowYear;
      }
      return true;
    });
  }, [incomes, selectedPeriod]);

  // Derived metrics purely from real database records (0 defaults)
  const metrics = useMemo(() => {
    const list = filteredIncomes;
    const total = list.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const entries = list.length;
    const avg = entries > 0 ? Math.round(total / entries) : 0;

    let highest = null;
    list.forEach((item) => {
      if (!highest || Number(item.amount) > Number(highest.amount)) {
        highest = item;
      }
    });

    return {
      totalIncome: total,
      totalEntries: entries,
      averageIncome: avg,
      highestIncome: highest ? Number(highest.amount) || 0 : 0,
      highestSource: highest ? (highest.source || highest.name || 'Income') : 'None',
      highestDate: highest?.date ? formatDate(highest.date) : '-',
      incomeChange: '+0.0%'
    };
  }, [filteredIncomes]);

  // Monthly Trend Data for This Year (12 months)
  const monthlyTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const nowYear = new Date().getFullYear();
    const totals = Array(12).fill(0);

    incomes.forEach((item) => {
      if (item.date) {
        const d = new Date(item.date);
        if (!isNaN(d.getTime()) && d.getFullYear() === nowYear) {
          totals[d.getMonth()] += Number(item.amount || 0);
        }
      }
    });

    return months.map((month, idx) => ({
      month,
      amount: totals[idx]
    }));
  }, [incomes]);

  // Category breakdown for Category Donut Chart
  const categoryData = useMemo(() => {
    if (filteredIncomes.length === 0) return [];

    const catMap = {};
    filteredIncomes.forEach((item) => {
      const cat = item.source || item.name || item.category || 'Other';
      catMap[cat] = (catMap[cat] || 0) + Number(item.amount || 0);
    });

    const colors = {
      Salary: '#35E9A0',
      Freelance: '#B18AFF',
      Investment: '#F6C85F',
      Business: '#FF667A',
      Other: '#20D6C7'
    };

    const total = Object.values(catMap).reduce((a, b) => a + b, 0);

    return Object.keys(catMap).map((key) => ({
      name: key === 'Business' ? 'Side Income' : key,
      value: catMap[key],
      percentage: total > 0 ? Math.round((catMap[key] / total) * 100) : 0,
      color: colors[key] || '#35E9A0'
    }));
  }, [filteredIncomes]);

  const dynamicInsights = useMemo(() => {
    if (incomes.length === 0) {
      return [
        {
          id: 'insight-empty',
          title: 'No income recorded yet',
          description: 'Add your salary, freelance payments, or other earnings to view income insights.',
          iconBg: 'bg-[#123D32]',
          iconColor: 'text-[#35E9A0]',
          hoverBorder: 'hover:border-[#35E9A0]/30'
        }
      ];
    }

    const total = filteredIncomes.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const catMap = {};
    filteredIncomes.forEach((item) => {
      const cat = item.source || item.name || item.category || 'Other';
      catMap[cat] = (catMap[cat] || 0) + Number(item.amount || 0);
    });

    let topSource = 'Income';
    let topVal = 0;
    Object.keys(catMap).forEach((k) => {
      if (catMap[k] > topVal) {
        topVal = catMap[k];
        topSource = k === 'Business' ? 'Side Income' : k;
      }
    });
    const topPct = total > 0 ? Math.round((topVal / total) * 100) : 0;

    return [
      {
        id: 'insight-1',
        title: total > 0 ? 'Income Active' : 'No income this period',
        description: total > 0 ? `You have recorded ${filteredIncomes.length} income entries for this period.` : 'No earnings recorded for this specific time period.',
        iconBg: 'bg-[#123D32]',
        iconColor: 'text-[#35E9A0]',
        hoverBorder: 'hover:border-[#35E9A0]/30'
      },
      {
        id: 'insight-2',
        title: `${topSource} is your main source`,
        description: topVal > 0 ? `${topPct}% of your income comes from ${topSource.toLowerCase()}.` : 'Record more sources to see diversification.',
        iconBg: 'bg-[#182C3D]',
        iconColor: 'text-[#45B7F5]',
        hoverBorder: 'hover:border-[#45B7F5]/30'
      },
      {
        id: 'insight-3',
        title: 'Income Streams',
        description: 'Track different income sources like salary, investments, and side projects in real time.',
        iconBg: 'bg-[#382F1B]',
        iconColor: 'text-[#F6C85F]',
        hoverBorder: 'hover:border-[#F6C85F]/30'
      }
    ];
  }, [incomes, filteredIncomes]);

  return (
    <div className="min-h-screen bg-[#0B1114] text-[#F1F5F4] flex">
      {/* 1. Left Sidebar (Income active) */}
      <Sidebar
        activeItem="Income"
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
          placeholder="Search income, categories, or notes..."
        />

        {/* Income Page Workspace */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1600px] w-full mx-auto">
          {/* Header Row: Title & Date Range */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-[28px] font-bold text-[#F1F5F4] tracking-tight">
                  Income
                </h1>
                <div className="w-6 h-6 rounded-md bg-[#123D32] flex items-center justify-center text-[#35E9A0]">
                  <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#A5B4B8] mt-0.5">
                Track and manage all your income sources in one place.
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
                <span className="font-medium">{selectedPeriod}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#71848A] transition-transform duration-200 ${
                    dateDropdownOpen ? 'rotate-180 text-[#35E9A0]' : ''
                  }`}
                />
              </button>

              {dateDropdownOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {['This Month', 'Last Month', 'This Year'].map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => {
                        setSelectedPeriod(range);
                        setDateDropdownOpen(false);
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

          {/* 3. Four Income Summary Cards */}
          <IncomeSummaryCard
            totalIncome={metrics.totalIncome}
            totalEntries={metrics.totalEntries}
            averageIncome={metrics.averageIncome}
            highestIncome={metrics.highestIncome}
            highestSource={metrics.highestSource}
            highestDate={metrics.highestDate}
            incomeChange={metrics.incomeChange}
          />

          {/* 4. Main Row: Monthly Income Trend & Add New Income (~60% / ~40% Split) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            {/* Left 60%: Monthly Income Trend */}
            <div className="lg:col-span-7 xl:col-span-7 min-w-0">
              <MonthlyIncomeChart
                data={monthlyTrendData}
                selectedPeriod="This Year"
              />
            </div>

            {/* Right 40%: Add New Income Form */}
            <div className="lg:col-span-5 xl:col-span-5 min-w-0">
              <AddIncomeForm
                onSuccess={fetchIncomeData}
              />
            </div>
          </div>

          {/* 5. Recent Income Table & Income by Category (~60% / ~40% Split) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            {/* Left 60%: Recent Income Table */}
            <div className="lg:col-span-7 xl:col-span-7 min-w-0">
              <RecentIncomeTable
                incomes={filteredIncomes}
                onEdit={(row) => setEditingIncome(row)}
                onRefresh={fetchIncomeData}
                searchQuery={searchQuery}
                onViewAll={() => navigate('/transactions?type=Income')}
              />
            </div>

            {/* Right 40%: Income by Category Donut Chart */}
            <div className="lg:col-span-5 xl:col-span-5 min-w-0">
              <IncomeCategoryChart
                categories={categoryData}
                totalIncome={metrics.totalIncome}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>
          </div>

          {/* 6. Bottom Row: Income Insights (Full-Width Card) */}
          <div className="pb-6">
            <IncomeInsights insights={dynamicInsights} />
          </div>
        </main>
      </div>

      {/* Edit Income Modal */}
      {editingIncome && (
        <EditIncomeModal
          isOpen={Boolean(editingIncome)}
          income={editingIncome}
          onClose={() => setEditingIncome(null)}
          onSuccess={fetchIncomeData}
        />
      )}
    </div>
  );
}

export default Income;
