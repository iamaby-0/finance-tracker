import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { formatDate } from '../utils/formatters';

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
        setIncomes(res.data.data);
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

  // Derived metrics from real data or reference fallbacks
  const hasLiveIncomes = incomes.length > 0;

  const getMetrics = () => {
    if (hasLiveIncomes) {
      const total = incomes.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      const entries = incomes.length;
      const avg = entries > 0 ? Math.round(total / entries) : 0;

      // Find highest entry
      let highest = incomes[0];
      incomes.forEach((item) => {
        if (Number(item.amount) > Number(highest.amount)) {
          highest = item;
        }
      });

      return {
        totalIncome: total,
        totalEntries: entries,
        averageIncome: avg,
        highestIncome: highest?.amount || 0,
        highestSource: highest?.source || highest?.name || 'Income',
        highestDate: highest?.date ? formatDate(highest.date) : 'Recently',
        incomeChange: '+8.2%'
      };
    }

    if (selectedPeriod === 'Last Month') {
      return {
        totalIncome: 78000,
        totalEntries: 4,
        averageIncome: 19500,
        highestIncome: 65000,
        highestSource: 'Salary',
        highestDate: 'Sep 19, 2026',
        incomeChange: '+6.5%'
      };
    }

    if (selectedPeriod === 'This Year') {
      return {
        totalIncome: 640000,
        totalEntries: 28,
        averageIncome: 22857,
        highestIncome: 75000,
        highestSource: 'Salary',
        highestDate: 'Jul 22, 2026',
        incomeChange: '+18.4%'
      };
    }

    // Default 'This Month' reference metrics
    return {
      totalIncome: 85000,
      totalEntries: 4,
      averageIncome: 21250,
      highestIncome: 70000,
      highestSource: 'Salary',
      highestDate: 'Oct 19, 2026',
      incomeChange: '+8.2%'
    };
  };

  const metrics = getMetrics();

  // Category breakdown for Category Donut Chart
  const getCategoryData = () => {
    if (hasLiveIncomes) {
      const catMap = {};
      incomes.forEach((item) => {
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
    }
    return null; // Will use DEFAULT_INCOME_CATEGORIES in component
  };

  const getDynamicInsights = () => {
    if (hasLiveIncomes) {
      const total = incomes.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      const catMap = {};
      incomes.forEach((item) => {
        const cat = item.source || item.name || item.category || 'Other';
        catMap[cat] = (catMap[cat] || 0) + Number(item.amount || 0);
      });

      let topSource = 'Salary';
      let topVal = 0;
      Object.keys(catMap).forEach((k) => {
        if (catMap[k] > topVal) {
          topVal = catMap[k];
          topSource = k === 'Business' ? 'Side Income' : k;
        }
      });
      const topPct = total > 0 ? Math.round((topVal / total) * 100) : 100;

      return [
        {
          id: 'insight-1',
          title: 'Income increased by 8.2%',
          description: 'Your income is higher than last month. Keep up the good work!',
          iconBg: 'bg-[#123D32]',
          iconColor: 'text-[#35E9A0]',
          hoverBorder: 'hover:border-[#35E9A0]/30'
        },
        {
          id: 'insight-2',
          title: `${topSource} is your main source`,
          description: `${topPct}% of your income comes from ${topSource.toLowerCase()}. Consider diversifying your income.`,
          iconBg: 'bg-[#182C3D]',
          iconColor: 'text-[#45B7F5]',
          hoverBorder: 'hover:border-[#45B7F5]/30'
        },
        {
          id: 'insight-3',
          title: 'Opportunity',
          description: 'You can explore freelance or side income to increase your earnings.',
          iconBg: 'bg-[#382F1B]',
          iconColor: 'text-[#F6C85F]',
          hoverBorder: 'hover:border-[#F6C85F]/30'
        }
      ];
    }
    return null;
  };

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
                incomes={hasLiveIncomes ? incomes : null}
                onEdit={(row) => setEditingIncome(row)}
                onRefresh={fetchIncomeData}
                searchQuery={searchQuery}
                onViewAll={() => navigate('/transactions?type=Income')}
              />
            </div>

            {/* Right 40%: Income by Category Donut Chart */}
            <div className="lg:col-span-5 xl:col-span-5 min-w-0">
              <IncomeCategoryChart
                categories={getCategoryData()}
                totalIncome={metrics.totalIncome}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>
          </div>

          {/* 6. Bottom Row: Income Insights (Full-Width Card) */}
          <div className="pb-6">
            <IncomeInsights insights={getDynamicInsights()} />
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
