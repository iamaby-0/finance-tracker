import React, { useState, useEffect, useCallback, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import AISummaryCards from '../components/ai-insights/AISummaryCards';
import TopInsights from '../components/ai-insights/TopInsights';
import SpendingInsightsCategory from '../components/ai-insights/SpendingInsightsCategory';
import FinancialGoalsProgress from '../components/ai-insights/FinancialGoalsProgress';
import SmartRecommendations from '../components/ai-insights/SmartRecommendations';
import FinanceAIChat from '../components/ai-insights/FinanceAIChat';
import { Sparkles, Calendar, ChevronDown, Check } from 'lucide-react';

export function AIInsights() {
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [period, setPeriod] = useState('This Month');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [insightsData, setInsightsData] = useState(null);

  const periodDropdownRef = useRef(null);

  const periodsList = [
    'This Month',
    'Last Month',
    'Last 3 Months',
    'Last 6 Months',
    'This Year'
  ];

  // Close period dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(e.target)) {
        setPeriodOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchInsights = useCallback(async (selectedPeriod) => {
    try {
      setLoading(true);
      const res = await api.get('/ai/financial-insights', {
        params: { period: selectedPeriod || period }
      });
      if (res.data && res.data.success) {
        setInsightsData(res.data.data);
      }
    } catch (err) {
      console.warn('Could not fetch AI financial insights:', err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchInsights(period);
  }, [period, fetchInsights]);

  return (
    <div className="min-h-screen bg-[#0B1114] text-[#F1F5F4] flex">
      {/* Sidebar - Permanent on desktop, drawer on mobile */}
      <Sidebar
        activeItem="AI Insights"
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
          placeholder="Search transactions, categories, or ask AI anything..."
        />

        {/* Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1700px] w-full mx-auto">
          {/* Header Row: Title & Period Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#F1F5F4] tracking-tight flex items-center gap-2">
                  <span>AI Insights</span>
                  <Sparkles className="w-5 h-5 text-[#35E9A0] fill-[#35E9A0]/20" />
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#71848A] mt-1 font-normal leading-relaxed">
                Your personal financial analyst. Get insights, recommendations and chat with AI to make smarter financial decisions.
              </p>
            </div>

            {/* Period Selector Dropdown */}
            <div className="relative shrink-0" ref={periodDropdownRef}>
              <button
                onClick={() => setPeriodOpen(!periodOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121E22] border border-[#24363B] text-xs font-semibold text-[#F1F5F4] hover:border-[#35E9A0]/40 transition shadow-xs cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#35E9A0]" />
                <span>{period}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#71848A] transition-transform duration-200 ${
                    periodOpen ? 'rotate-180 text-[#35E9A0]' : ''
                  }`}
                />
              </button>

              {periodOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[#121E22] border border-[#24363B] rounded-xl shadow-2xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                  {periodsList.map((p) => {
                    const isSelected = period === p;
                    return (
                      <button
                        key={p}
                        onClick={() => {
                          setPeriod(p);
                          setPeriodOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer text-left ${
                          isSelected
                            ? 'bg-[#15372F] text-[#35E9A0]'
                            : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C]'
                        }`}
                      >
                        <span>{p}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#35E9A0]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Unified Two-Column Dashboard Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
            {/* Left Column: Analytics & Insights Dashboard (~63% on desktop / 7-8 cols of 12) */}
            <div className="xl:col-span-8 space-y-5">
              {/* 1. Four Financial Summary Cards */}
              <AISummaryCards summary={insightsData?.summaryCards} loading={loading} />

              {/* 2. Top Insights for You */}
              <TopInsights insights={insightsData?.topInsights} loading={loading} />

              {/* 3. Spending Insights by Category */}
              <SpendingInsightsCategory
                expenseCategories={insightsData?.expenseCategories}
                incomeCategories={insightsData?.incomeCategories}
                totalExpenses={insightsData?.totalExpenses}
                totalIncome={insightsData?.totalIncome}
                period={period}
                onPeriodChange={setPeriod}
              />

              {/* 4. Bottom Row: Goals Progress & Smart Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FinancialGoalsProgress goals={insightsData?.goals} />
                <SmartRecommendations recommendations={insightsData?.recommendations} />
              </div>
            </div>

            {/* Right Column: Finance AI Assistant Chat Panel (~37% on desktop / 4 cols of 12) */}
            <div className="xl:col-span-4 w-full">
              <FinanceAIChat period={period} financialContext={insightsData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AIInsights;
