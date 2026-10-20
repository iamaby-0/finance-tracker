import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  Briefcase, 
  Eye, 
  EyeOff, 
  PieChart, 
  Target, 
  BarChart3, 
  Sparkles, 
  TrendingUp, 
  ChevronDown, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";

import { registerUser } from "../services/authService";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    occupation: "student"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) {
      setServerError("");
    }
  };

  const validateForm = () => {
    const errors = { name: "", email: "", password: "", confirmPassword: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        occupation: formData.occupation
      });

      if (response?.success === false) {
        const backendMessage = response?.message || response?.error;
        setServerError(backendMessage || "Registration failed");
        return;
      }

      setSuccessMessage(response?.message || "Account created successfully! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      console.error("Signup error:", err);
      const backendError =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";

      setServerError(
        typeof backendError === "string" ? backendError : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-[#0B1114] text-[#F1F5F4] flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 py-10 selection:bg-[#35E9A0]/30 selection:text-white">
      
      {/* Background ambient lighting glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-20 w-[550px] h-[550px] bg-[#35E9A0]/10 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-[#123D32]/35 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-[#087F5B]/15 rounded-full blur-[130px]" />
      </div>

      {/* Main Container: Two-Column Layout on Desktop */}
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">

        {/* ========================================================= */}
        {/* LEFT PANEL: BRANDING, HERO & DECORATIVE DASHBOARD PREVIEW */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-7">
          
          {/* Brand Header */}
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="flex items-end gap-1 h-7">
              <span className="w-1.5 h-3.5 bg-[#35E9A0] rounded-xs shadow-[0_0_10px_rgba(53,233,160,0.5)]" />
              <span className="w-1.5 h-5 bg-[#35E9A0] rounded-xs shadow-[0_0_12px_rgba(53,233,160,0.6)]" />
              <span className="w-1.5 h-7 bg-[#4FFFB0] rounded-xs shadow-[0_0_15px_rgba(53,233,160,0.7)]" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-[#F1F5F4]">
                My Finance <span className="text-[#35E9A0]">Track</span>
              </span>
              <p className="text-[11px] text-[#71848A] tracking-wide">
                Track Your Money. Free Your Mind.
              </p>
            </div>
          </Link>

          {/* Partner Pill Badge */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#123D32]/60 border border-[#35E9A0]/30 text-[#35E9A0] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Your Personal Finance Partner</span>
            </div>
          </div>

          {/* Hero Headline & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F1F5F4] tracking-tight leading-[1.14]">
              Track Your Money.<br />
              <span className="text-[#35E9A0] drop-shadow-[0_0_35px_rgba(53,233,160,0.4)]">
                Free Your Mind.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[#A5B4B8] max-w-lg leading-relaxed">
              Make your money clear, your goals closer, and your mind calmer.
            </p>
            <p className="text-xs sm:text-sm text-[#71848A] max-w-lg leading-relaxed">
              Join thousands taking control of their finances with automated categorization, custom budgets, and AI insights.
            </p>
          </div>

          {/* 4 Feature Highlights */}
          <div className="grid sm:grid-cols-2 gap-3.5 pt-1">
            
            {/* Feature 1 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#121E22]/80 border border-[#24363B] hover:border-[#35E9A0]/30 transition-all">
              <div className="w-9 h-9 rounded-lg bg-[#123D32] text-[#35E9A0] flex items-center justify-center shrink-0 mt-0.5">
                <PieChart className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#F1F5F4]">Track Income & Expenses</p>
                <p className="text-[#A5B4B8] mt-0.5">Keep all your transactions in one place.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#121E22]/80 border border-[#24363B] hover:border-[#35E9A0]/30 transition-all">
              <div className="w-9 h-9 rounded-lg bg-[#B18AFF]/15 text-[#B18AFF] flex items-center justify-center shrink-0 mt-0.5">
                <Target className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#F1F5F4]">Plan Smarter Budgets</p>
                <p className="text-[#A5B4B8] mt-0.5">Set goals and stay on track.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#121E22]/80 border border-[#24363B] hover:border-[#35E9A0]/30 transition-all">
              <div className="w-9 h-9 rounded-lg bg-[#45B7F5]/15 text-[#45B7F5] flex items-center justify-center shrink-0 mt-0.5">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#F1F5F4]">Get AI-Powered Insights</p>
                <p className="text-[#A5B4B8] mt-0.5">Understand your spending and save more.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#121E22]/80 border border-[#24363B] hover:border-[#35E9A0]/30 transition-all">
              <div className="w-9 h-9 rounded-lg bg-[#F6C85F]/15 text-[#F6C85F] flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#F1F5F4]">Your Data Stays Private</p>
                <p className="text-[#A5B4B8] mt-0.5">Access your financial information through your account.</p>
              </div>
            </div>

          </div>

          {/* Decorative Miniature Financial Dashboard Card Preview */}
          <div className="relative pt-2">
            
            {/* Stylish annotation arrow and text */}
            <div className="hidden sm:flex items-center gap-2 text-right absolute -top-3 right-6 z-10 pointer-events-none">
              <div className="text-[11px] font-semibold text-[#35E9A0] italic leading-tight tracking-wide font-mono">
                Track<br />
                &nbsp;&nbsp;Analyze<br />
                &nbsp;&nbsp;&nbsp;&nbsp;Improve
              </div>
              <svg className="w-7 h-7 text-[#35E9A0] -rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* Dashboard Mockup Tablet Card */}
            <div className="relative rounded-2xl p-4 sm:p-5 bg-[#101A1D] border border-[#24363B] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(53,233,160,0.12)]">
              
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[11px] font-medium text-[#A5B4B8]">Total Balance</p>
                  <p className="text-xl sm:text-2xl font-extrabold text-[#F1F5F4] tracking-tight mt-0.5">
                    ₹ 1,24,520
                  </p>
                  <p className="text-[11px] font-semibold text-[#35E9A0] flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12.5% this month</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#18272C] border border-[#24363B] text-[#A5B4B8] text-[11px] font-medium">
                  <span>This Month</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>

              {/* Glowing Green Curve Chart */}
              <div className="relative w-full h-20 my-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" fill="none">
                  <defs>
                    <linearGradient id="signupCurveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#35E9A0" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#35E9A0" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="signupNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#35E9A0" floodOpacity="0.7" />
                    </filter>
                  </defs>
                  <path
                    d="M 10 80 C 70 85, 110 65, 160 70 C 220 75, 270 45, 330 50 C 390 55, 430 25, 490 20 L 490 100 L 10 100 Z"
                    fill="url(#signupCurveGrad)"
                  />
                  <path
                    d="M 10 80 C 70 85, 110 65, 160 70 C 220 75, 270 45, 330 50 C 390 55, 430 25, 490 20"
                    stroke="#35E9A0"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    filter="url(#signupNeonGlow)"
                  />
                  <circle cx="10" cy="80" r="3" fill="#35E9A0" />
                  <circle cx="160" cy="70" r="3" fill="#35E9A0" />
                  <circle cx="330" cy="50" r="3" fill="#35E9A0" />
                  <circle cx="490" cy="20" r="4" fill="#35E9A0" />
                </svg>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#123D32] text-[#35E9A0] flex items-center justify-center mb-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-[10px] text-[#A5B4B8]">Income</p>
                  <p className="text-xs sm:text-sm font-bold text-[#F1F5F4] mt-0.5">₹ 85,000</p>
                </div>

                <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#FF667A]/15 text-[#FF667A] flex items-center justify-center mb-1.5">
                    <TrendingUp className="w-3.5 h-3.5 rotate-180" />
                  </div>
                  <p className="text-[10px] text-[#A5B4B8]">Expenses</p>
                  <p className="text-xs sm:text-sm font-bold text-[#F1F5F4] mt-0.5">₹ 42,350</p>
                </div>

                <div className="bg-[#121E22] border border-[#24363B] rounded-xl p-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#45B7F5]/15 text-[#45B7F5] flex items-center justify-center mb-1.5">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-[10px] text-[#A5B4B8]">Budget</p>
                  <p className="text-xs sm:text-sm font-bold text-[#F1F5F4] mt-0.5">₹ 47,650</p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT PANEL: CENTERED SIGNUP CARD */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 xl:col-span-5 flex justify-center">
          
          <div className="w-full max-w-[500px] bg-[#121E22] border border-[#24363B] rounded-[20px] p-7 sm:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(53,233,160,0.08)] relative">

            {/* Header: Logo and Application Name */}
            <div className="text-center mb-6">
              <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
                <div className="flex items-end gap-1 h-6">
                  <span className="w-1.5 h-3 bg-[#35E9A0] rounded-xs shadow-[0_0_8px_rgba(53,233,160,0.5)]" />
                  <span className="w-1.5 h-4.5 bg-[#35E9A0] rounded-xs shadow-[0_0_10px_rgba(53,233,160,0.6)]" />
                  <span className="w-1.5 h-6 bg-[#4FFFB0] rounded-xs shadow-[0_0_12px_rgba(53,233,160,0.7)]" />
                </div>
                <span className="text-xl font-bold tracking-tight text-[#F1F5F4] group-hover:text-white transition">
                  My Finance <span className="text-[#35E9A0]">Track</span>
                </span>
              </Link>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F1F5F4] tracking-tight">
                Create an Account
              </h2>
              <p className="text-xs sm:text-sm text-[#A5B4B8] mt-1">
                Start your journey to financial freedom
              </p>
            </div>

            {/* Server Error Message */}
            {serverError && (
              <div className="mb-4 rounded-xl bg-[#FF667A]/15 border border-[#FF667A]/35 px-4 py-3 flex items-start gap-2.5 text-xs text-[#FF667A]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 rounded-xl bg-[#35E9A0]/15 border border-[#35E9A0]/35 px-4 py-3 flex items-start gap-2.5 text-xs text-[#35E9A0]">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full h-11 px-4 rounded-xl border border-[#24363B] hover:border-[#35E9A0]/50 bg-[#18272C] hover:bg-[#203238] text-[#F1F5F4] text-sm font-medium transition duration-200 flex items-center justify-center gap-3 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#35E9A0]/30"
            >
              {/* Official Google G Logo */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Separator */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#24363B]" />
              <span className="text-[11px] font-medium text-[#71848A] uppercase tracking-wider">
                or
              </span>
              <div className="flex-1 h-px bg-[#24363B]" />
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              
              {/* Full Name */}
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-xs font-medium text-[#A5B4B8] mb-1"
                >
                  Full name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71848A]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full h-10.5 pl-10 pr-3 text-sm bg-[#18272C] border rounded-xl outline-none transition text-[#F1F5F4] placeholder:text-[#71848A] focus:ring-1 ${
                      formErrors.name 
                        ? "border-[#FF667A] focus:border-[#FF667A] focus:ring-[#FF667A]/25" 
                        : "border-[#24363B] focus:border-[#35E9A0] focus:ring-[#35E9A0]/25"
                    }`}
                  />
                </div>
                {formErrors.name && (
                  <p className="mt-1 text-xs text-[#FF667A]">{formErrors.name}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-xs font-medium text-[#A5B4B8] mb-1"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71848A]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className={`w-full h-10.5 pl-10 pr-3 text-sm bg-[#18272C] border rounded-xl outline-none transition text-[#F1F5F4] placeholder:text-[#71848A] focus:ring-1 ${
                      formErrors.email 
                        ? "border-[#FF667A] focus:border-[#FF667A] focus:ring-[#FF667A]/25" 
                        : "border-[#24363B] focus:border-[#35E9A0] focus:ring-[#35E9A0]/25"
                    }`}
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-xs text-[#FF667A]">{formErrors.email}</p>
                )}
              </div>

              {/* Occupation */}
              <div>
                <label 
                  htmlFor="occupation" 
                  className="block text-xs font-medium text-[#A5B4B8] mb-1"
                >
                  Occupation
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71848A]">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <select
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full h-10.5 pl-10 pr-8 text-sm bg-[#18272C] border border-[#24363B] rounded-xl outline-none transition text-[#F1F5F4] focus:border-[#35E9A0] focus:ring-1 focus:ring-[#35E9A0]/25 appearance-none cursor-pointer"
                  >
                    <option value="student" className="bg-[#18272C] text-[#F1F5F4]">Student</option>
                    <option value="employed" className="bg-[#18272C] text-[#F1F5F4]">Employed</option>
                    <option value="unemployed" className="bg-[#18272C] text-[#F1F5F4]">Unemployed</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#71848A]">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-xs font-medium text-[#A5B4B8] mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71848A]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Create a password (6+ chars)"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className={`w-full h-10.5 pl-10 pr-10 text-sm bg-[#18272C] border rounded-xl outline-none transition text-[#F1F5F4] placeholder:text-[#71848A] focus:ring-1 ${
                      formErrors.password 
                        ? "border-[#FF667A] focus:border-[#FF667A] focus:ring-[#FF667A]/25" 
                        : "border-[#24363B] focus:border-[#35E9A0] focus:ring-[#35E9A0]/25"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#71848A] hover:text-[#F1F5F4] transition focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-xs text-[#FF667A]">{formErrors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-xs font-medium text-[#A5B4B8] mb-1"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71848A]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className={`w-full h-10.5 pl-10 pr-10 text-sm bg-[#18272C] border rounded-xl outline-none transition text-[#F1F5F4] placeholder:text-[#71848A] focus:ring-1 ${
                      formErrors.confirmPassword 
                        ? "border-[#FF667A] focus:border-[#FF667A] focus:ring-[#FF667A]/25" 
                        : "border-[#24363B] focus:border-[#35E9A0] focus:ring-[#35E9A0]/25"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#71848A] hover:text-[#F1F5F4] transition focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-[#FF667A]">{formErrors.confirmPassword}</p>
                )}
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] text-sm font-bold shadow-[0_0_20px_rgba(53,233,160,0.3)] hover:shadow-[0_0_28px_rgba(53,233,160,0.5)] transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 focus:outline-none focus:ring-2 focus:ring-[#35E9A0]/40"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0B1114] border-t-transparent rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>

            </form>

            {/* Sign In Link */}
            <div className="text-center mt-5 pt-4 border-t border-[#24363B]">
              <p className="text-xs text-[#A5B4B8]">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="font-semibold text-[#35E9A0] hover:text-[#4FFFB0] hover:underline transition"
                >
                  Sign in
                </Link>
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;