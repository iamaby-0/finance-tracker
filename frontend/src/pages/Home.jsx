import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  BarChart3, 
  PieChart, 
  Sliders, 
  Lightbulb, 
  CalendarRange, 
  ArrowRight, 
  ArrowLeftRight, 
  PlusCircle, 
  CheckCircle2, 
  Menu, 
  X,
  CreditCard,
  ChevronRight
} from "lucide-react";
import useAuth from "../hooks/useAuth";

// ============================================================================
// 1. NAVIGATION BAR COMPONENT
// ============================================================================
function Navbar() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B1114]/90 border-b border-[#24363B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo: My Finance Track with Financial Chart Icon */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#121E22] border border-[#24363B] group-hover:border-[#35E9A0]/50 flex items-center justify-center transition-all duration-200 shadow-sm">
            <div className="flex items-end gap-1 h-5">
              <span className="w-1.5 h-2.5 bg-[#35E9A0] rounded-xs" />
              <span className="w-1.5 h-4 bg-[#35E9A0] rounded-xs" />
              <span className="w-1.5 h-5 bg-[#4FFFB0] rounded-xs" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#F1F5F4] group-hover:text-white transition">
            My Finance Track
          </span>
        </Link>

        {/* Desktop Navigation Links ONLY: Home, Features, How It Works, About */}
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#home" 
            className="text-sm font-medium text-[#A5B4B8] hover:text-[#F1F5F4] transition-colors"
          >
            Home
          </a>
          <a 
            href="#features" 
            className="text-sm font-medium text-[#A5B4B8] hover:text-[#F1F5F4] transition-colors"
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="text-sm font-medium text-[#A5B4B8] hover:text-[#F1F5F4] transition-colors"
          >
            How It Works
          </a>
          <a 
            href="#about" 
            className="text-sm font-medium text-[#A5B4B8] hover:text-[#F1F5F4] transition-colors"
          >
            About
          </a>
        </nav>

        {/* Right CTA Actions: Sign In & Get Started Free */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[#0B1114] bg-[#35E9A0] hover:bg-[#4FFFB0] shadow-[0_0_20px_rgba(53,233,160,0.3)] transition-all hover:scale-[1.02]"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4.5 py-2 text-sm font-medium text-[#F1F5F4] hover:text-white border border-[#24363B] hover:border-[#35E9A0]/50 bg-[#121E22] hover:bg-[#18272C] rounded-xl transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 text-sm font-bold text-[#0B1114] bg-[#35E9A0] hover:bg-[#4FFFB0] rounded-xl shadow-[0_0_20px_rgba(53,233,160,0.3)] hover:shadow-[0_0_28px_rgba(53,233,160,0.5)] transition-all duration-200 hover:scale-[1.02]"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#A5B4B8] hover:text-[#F1F5F4] rounded-lg focus:outline-none"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 border-b border-[#24363B] bg-[#101A1D]/95 backdrop-blur-2xl space-y-3">
          <a 
            href="#home" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C]"
          >
            Home
          </a>
          <a 
            href="#features" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C]"
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C]"
          >
            How It Works
          </a>
          <a 
            href="#about" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#18272C]"
          >
            About
          </a>
          <div className="pt-3 flex flex-col gap-2.5">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-[#0B1114] bg-[#35E9A0]"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-xl text-sm font-medium text-[#F1F5F4] border border-[#24363B] bg-[#121E22]"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-[#0B1114] bg-[#35E9A0]"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// ============================================================================
// 2. DASHBOARD PREVIEW COMPONENT (Illustrative Sample Data)
// ============================================================================
function DashboardPreview() {
  return (
    <div className="w-full max-w-[560px] relative">
      {/* Ambient background glow */}
      <div className="absolute -inset-4 bg-[#35E9A0]/15 blur-[90px] rounded-3xl -z-10 pointer-events-none" />

      {/* Outer Chassis */}
      <div className="relative rounded-3xl p-3 bg-[#101A1D] border border-[#24363B] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)]">
        
        {/* Subtle top rim highlight */}
        <div className="absolute inset-0 rounded-3xl border border-[#35E9A0]/20 pointer-events-none" />

        {/* Inner Screen Surface */}
        <div className="relative rounded-2xl p-5 bg-[#121E22] border border-[#24363B]/60 space-y-4">
          
          {/* Header Row: Label & Illustrative Badge */}
          <div className="flex items-center justify-between pb-2 border-b border-[#24363B]/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#35E9A0] shadow-[0_0_8px_rgba(53,233,160,0.6)]" />
              <span className="text-xs font-semibold text-[#A5B4B8] tracking-wider uppercase">
                Financial Overview
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#71848A] bg-[#18272C] px-2.5 py-0.5 rounded-md border border-[#24363B]">
              Illustrative Preview
            </span>
          </div>

          {/* Balance Card & Summaries */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Total Balance */}
            <div className="sm:col-span-1 bg-[#18272C] border border-[#24363B] rounded-xl p-3">
              <p className="text-[11px] font-medium text-[#A5B4B8]">Total Balance</p>
              <h3 className="text-xl font-extrabold text-[#F1F5F4] tracking-tight mt-0.5">
                ₹84,250
              </h3>
              <p className="text-[11px] font-semibold text-[#35E9A0] flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>+8.4% this month</span>
              </p>
            </div>

            {/* Income Card */}
            <div className="bg-[#18272C] border border-[#24363B] rounded-xl p-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-[#A5B4B8]">Income</p>
                <span className="w-1.5 h-1.5 rounded-full bg-[#35E9A0]" />
              </div>
              <h3 className="text-base font-bold text-[#35E9A0] tracking-tight mt-1">
                ₹65,000
              </h3>
              <p className="text-[10px] text-[#71848A] mt-1">Total received</p>
            </div>

            {/* Expenses Card */}
            <div className="bg-[#18272C] border border-[#24363B] rounded-xl p-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-[#A5B4B8]">Expenses</p>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF667A]" />
              </div>
              <h3 className="text-base font-bold text-[#FF667A] tracking-tight mt-1">
                ₹32,400
              </h3>
              <p className="text-[10px] text-[#71848A] mt-1">Within budget</p>
            </div>

          </div>

          {/* Simple Financial Chart Curve */}
          <div className="bg-[#18272C] border border-[#24363B] rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#F1F5F4]">Cash Flow Trend</span>
              <span className="text-[11px] text-[#A5B4B8]">Last 30 Days</span>
            </div>

            <div className="h-24 w-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 450 90" fill="none">
                <defs>
                  <linearGradient id="mintGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#35E9A0" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#35E9A0" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area */}
                <path
                  d="M 10 70 C 60 75, 110 50, 160 55 C 220 60, 270 30, 330 35 C 380 40, 410 15, 440 12 L 440 90 L 10 90 Z"
                  fill="url(#mintGrad)"
                />
                {/* Line */}
                <path
                  d="M 10 70 C 60 75, 110 50, 160 55 C 220 60, 270 30, 330 35 C 380 40, 410 15, 440 12"
                  stroke="#35E9A0"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Dots */}
                <circle cx="10" cy="70" r="3" fill="#35E9A0" />
                <circle cx="160" cy="55" r="3" fill="#35E9A0" />
                <circle cx="330" cy="35" r="3" fill="#35E9A0" />
                <circle cx="440" cy="12" r="4" fill="#35E9A0" />
              </svg>
            </div>
          </div>

          {/* Spending-Category Breakdown */}
          <div className="bg-[#18272C] border border-[#24363B] rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#F1F5F4]">Spending Breakdown</span>
              <span className="text-[11px] text-[#A5B4B8]">4 Categories</span>
            </div>

            {/* Category Bars */}
            <div className="space-y-2 pt-1 text-xs">
              <div>
                <div className="flex justify-between text-[#A5B4B8] mb-1 text-[11px]">
                  <span>Housing & Rent</span>
                  <span className="text-[#F1F5F4] font-medium">₹12,000 (37%)</span>
                </div>
                <div className="w-full h-1.5 bg-[#121E22] rounded-full overflow-hidden">
                  <div className="h-full bg-[#45B7F5] rounded-full" style={{ width: "37%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#A5B4B8] mb-1 text-[11px]">
                  <span>Food & Groceries</span>
                  <span className="text-[#F1F5F4] font-medium">₹8,500 (26%)</span>
                </div>
                <div className="w-full h-1.5 bg-[#121E22] rounded-full overflow-hidden">
                  <div className="h-full bg-[#35E9A0] rounded-full" style={{ width: "26%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#A5B4B8] mb-1 text-[11px]">
                  <span>Utilities & Bills</span>
                  <span className="text-[#F1F5F4] font-medium">₹5,200 (16%)</span>
                </div>
                <div className="w-full h-1.5 bg-[#121E22] rounded-full overflow-hidden">
                  <div className="h-full bg-[#F6C85F] rounded-full" style={{ width: "16%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Small AI Insights Card */}
          <div className="bg-[#18272C] border border-[#B18AFF]/30 rounded-xl p-3 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#B18AFF]/15 text-[#B18AFF] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[#F1F5F4] flex items-center gap-1.5">
                AI Financial Insight
                <span className="text-[10px] text-[#B18AFF] font-medium bg-[#B18AFF]/10 px-1.5 py-0.2 rounded">Smart</span>
              </p>
              <p className="text-[#A5B4B8] mt-0.5 leading-relaxed">
                You spent 14% less on discretionary dining this week. You are well on track for your monthly savings goal.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. HERO SECTION COMPONENT
// ============================================================================
function Hero() {
  return (
    <section id="home" className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Subtitle, Description, CTA */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 z-10">
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-[#F1F5F4] tracking-tight leading-[1.12]">
              Track Your Money. <br />
              <span className="text-[#35E9A0] drop-shadow-[0_0_35px_rgba(53,233,160,0.45)]">
                Free Your Mind.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl font-medium text-[#A5B4B8] leading-snug">
              Make your money clear, your goals closer, and your mind calmer.
            </p>

            {/* Short Supporting Description */}
            <p className="text-sm sm:text-base text-[#71848A] max-w-lg leading-relaxed">
              Track your income, manage expenses, plan budgets, and understand your spending with AI-powered financial insights — all in one place.
            </p>

            {/* Two Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] font-bold text-base rounded-xl shadow-[0_0_25px_rgba(53,233,160,0.35)] hover:shadow-[0_0_35px_rgba(53,233,160,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#24363B] hover:border-[#35E9A0]/50 bg-[#121E22] hover:bg-[#18272C] text-[#F1F5F4] font-semibold text-base rounded-xl transition-all duration-200"
              >
                <span>Explore Features</span>
              </a>
            </div>

            {/* Understated Line */}
            <p className="text-xs text-[#71848A] font-medium tracking-wide pt-1">
              Your money, made simpler.
            </p>

          </div>

          {/* Right Column: Realistic Dashboard Preview */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end">
            <DashboardPreview />
          </div>

        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 4. FEATURES SECTION COMPONENT (6 Cards)
// ============================================================================
function Features() {
  const featureList = [
    {
      title: "AI Expense Categorization",
      description: "Automatically categorize expenses with AI and reduce manual effort.",
      icon: Sparkles,
      iconColor: "text-[#B18AFF]",
      iconBg: "bg-[#B18AFF]/15"
    },
    {
      title: "Income & Expense Tracking",
      description: "Record and organize your income and spending in one place.",
      icon: ArrowLeftRight,
      iconColor: "text-[#35E9A0]",
      iconBg: "bg-[#123D32]"
    },
    {
      title: "Smart Budget Management",
      description: "Create budgets, monitor spending, and see how much remains.",
      icon: Sliders,
      iconColor: "text-[#45B7F5]",
      iconBg: "bg-[#45B7F5]/15"
    },
    {
      title: "Financial Analytics",
      description: "Visualize your cash flow, spending patterns, and savings with clear charts.",
      icon: BarChart3,
      iconColor: "text-[#4FD1C5]",
      iconBg: "bg-[#4FD1C5]/15"
    },
    {
      title: "AI Financial Insights",
      description: "Get personalized summaries and practical insights based on your financial activity.",
      icon: Lightbulb,
      iconColor: "text-[#B18AFF]",
      iconBg: "bg-[#B18AFF]/15"
    },
    {
      title: "Reports & Spending Trends",
      description: "Review your financial activity over monthly and yearly periods.",
      icon: CalendarRange,
      iconColor: "text-[#35E9A0]",
      iconBg: "bg-[#123D32]"
    }
  ];

  return (
    <section id="features" className="py-24 border-t border-[#24363B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123D32] border border-[#35E9A0]/30 text-[#35E9A0] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F1F5F4] tracking-tight">
            Everything You Need to Manage Your Money
          </h2>
          <p className="text-[#A5B4B8] text-sm sm:text-base leading-relaxed">
            Simple tools to help you understand your finances, make better decisions, and build healthier money habits.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-[#121E22] border border-[#24363B] hover:border-[#35E9A0]/50 hover:bg-[#18272C] p-6 sm:p-7 rounded-2xl transition-all duration-200 hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#F1F5F4] mb-2 group-hover:text-white transition">
                  {item.title}
                </h3>
                <p className="text-sm text-[#A5B4B8] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

// ============================================================================
// 5. HOW IT WORKS COMPONENT (3 Steps)
// ============================================================================
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Track Your Money",
      description: "Add income and expenses to keep your records organized.",
      icon: PlusCircle
    },
    {
      num: "02",
      title: "Understand Your Spending",
      description: "Explore your budgets, charts, and spending categories.",
      icon: PieChart
    },
    {
      num: "03",
      title: "Make Smarter Decisions",
      description: "Use financial insights to improve your money habits.",
      icon: CheckCircle2
    }
  ];

  return (
    <section id="how-it-works" className="py-24 border-t border-[#24363B] bg-[#101A1D]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123D32] border border-[#35E9A0]/30 text-[#35E9A0] text-xs font-semibold uppercase tracking-wider">
            <span>Simple Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F1F5F4] tracking-tight">
            How It Works
          </h2>
          <p className="text-[#A5B4B8] text-sm sm:text-base">
            Three straightforward steps to take control of your financial journey.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="bg-[#121E22] border border-[#24363B] hover:border-[#35E9A0]/40 rounded-2xl p-7 relative flex flex-col justify-between transition-all duration-200 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#123D32] text-[#35E9A0] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-extrabold text-[#71848A]/50 tracking-tight font-mono">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#F1F5F4] mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#A5B4B8] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

// ============================================================================
// 6. ABOUT SECTION COMPONENT
// ============================================================================
function About() {
  return (
    <section id="about" className="py-24 border-t border-[#24363B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123D32] border border-[#35E9A0]/30 text-[#35E9A0] text-xs font-semibold uppercase tracking-wider">
              <span>About My Finance Track</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F1F5F4] tracking-tight leading-tight">
              A Clearer Picture of Your Financial Life
            </h2>
            
            <p className="text-sm sm:text-base text-[#A5B4B8] leading-relaxed">
              My Finance Track helps you bring your income, expenses, budgets, and financial insights together in one place. Understand where your money goes, make informed choices, and work toward your financial goals with greater confidence.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#121E22] border border-[#24363B]">
                <h4 className="text-sm font-bold text-[#F1F5F4] mb-1">Single Dashboard View</h4>
                <p className="text-xs text-[#71848A] leading-relaxed">
                  Consolidated tracking of all spending, earnings, and monthly goals without visual clutter.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#121E22] border border-[#24363B]">
                <h4 className="text-sm font-bold text-[#F1F5F4] mb-1">Practical Insights</h4>
                <p className="text-xs text-[#71848A] leading-relaxed">
                  Clear spending patterns and trends to help guide everyday financial habits.
                </p>
              </div>
            </div>
          </div>

          {/* Right Supporting Visual Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#121E22] border border-[#24363B] rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#24363B]">
                <span className="text-xs font-semibold text-[#A5B4B8] uppercase tracking-wider">Financial Clarity</span>
                <span className="text-xs font-semibold text-[#35E9A0] bg-[#123D32] px-2.5 py-1 rounded-md">Balanced</span>
              </div>

              <div className="py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#A5B4B8]">Monthly Savings Target</span>
                  <span className="text-xs font-bold text-[#F1F5F4]">78% achieved</span>
                </div>
                <div className="w-full h-2 bg-[#18272C] rounded-full overflow-hidden">
                  <div className="h-full bg-[#35E9A0] rounded-full" style={{ width: "78%" }} />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-[#A5B4B8]">Budget Adherence</span>
                  <span className="text-xs font-bold text-[#45B7F5]">Good standing</span>
                </div>
                <div className="w-full h-2 bg-[#18272C] rounded-full overflow-hidden">
                  <div className="h-full bg-[#45B7F5] rounded-full" style={{ width: "88%" }} />
                </div>
              </div>

              <div className="pt-4 border-t border-[#24363B]">
                <p className="text-xs text-[#71848A] italic">
                  “Track your income, understand your habits, and build financial peace of mind.”
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 7. FINAL CALL TO ACTION COMPONENT
// ============================================================================
function CTA() {
  return (
    <section className="py-20 relative overflow-hidden border-t border-[#24363B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Card with subtle mint-green glow */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#18272C] to-[#121E22] border border-[#35E9A0]/30 p-10 sm:p-14 text-center overflow-hidden shadow-[0_0_60px_rgba(53,233,160,0.12)]">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#35E9A0]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F1F5F4] tracking-tight">
              Ready to Take Control of Your Money?
            </h2>
            <p className="text-[#A5B4B8] text-sm sm:text-base leading-relaxed">
              Start tracking your finances, build better habits, and move toward your goals with confidence.
            </p>
            <div className="pt-3 flex justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] font-bold text-base rounded-xl shadow-[0_0_25px_rgba(53,233,160,0.35)] hover:shadow-[0_0_35px_rgba(53,233,160,0.55)] transition-all duration-200"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

// ============================================================================
// 8. FOOTER COMPONENT
// ============================================================================
function Footer() {
  return (
    <footer className="py-12 border-t border-[#24363B] bg-[#101A1D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Brand Info */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="flex items-end gap-1 h-5">
                <span className="w-1 h-2 bg-[#35E9A0] rounded-xs" />
                <span className="w-1 h-3.5 bg-[#35E9A0] rounded-xs" />
                <span className="w-1 h-4.5 bg-[#4FFFB0] rounded-xs" />
              </div>
              <span className="text-lg font-bold text-[#F1F5F4]">My Finance Track</span>
            </div>
            <p className="text-xs text-[#71848A]">
              Track your money. Free your mind.
            </p>
          </div>

          {/* Navigation & Auth Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-[#A5B4B8]">
            <a href="#home" className="hover:text-[#F1F5F4] transition">Home</a>
            <a href="#features" className="hover:text-[#F1F5F4] transition">Features</a>
            <a href="#how-it-works" className="hover:text-[#F1F5F4] transition">How It Works</a>
            <a href="#about" className="hover:text-[#F1F5F4] transition">About</a>
            <span className="text-[#24363B]">|</span>
            <Link to="/login" className="hover:text-[#F1F5F4] transition">Sign In</Link>
            <Link to="/signup" className="hover:text-[#35E9A0] font-medium transition">Sign Up</Link>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-6 border-t border-[#24363B]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#71848A]">
          <p>© {new Date().getFullYear()} My Finance Track. All rights reserved.</p>
          <p>Developed by Abrar Ahmad</p>
        </div>

      </div>
    </footer>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B1114] text-[#F1F5F4] relative overflow-x-hidden selection:bg-[#35E9A0]/30 selection:text-white">
      
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 right-[-10%] w-[680px] h-[680px] bg-[#35E9A0]/10 rounded-full blur-[140px]" />
        <div className="absolute top-[35%] -left-36 w-[520px] h-[520px] bg-[#123D32]/35 rounded-full blur-[130px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-[#087F5B]/15 rounded-full blur-[150px]" />
      </div>

      {/* Structured Sections */}
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <About />
        <CTA />
      </main>
      <Footer />

    </div>
  );
}
