import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

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

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();
        setMessage("");
        setError("");


        // Password validation

        if (formData.password !== formData.confirmPassword) {

            setError("Passwords do not match");

            return;
        }


        if (formData.password.length < 6) {

            setError(
                "Password must be at least 6 characters"
            );

            return;
        }


        setLoading(true);


        try {

            const response = await registerUser({

                name: formData.name,

                email: formData.email,

                password: formData.password,

                occupation: formData.occupation

            });

            if (response?.success === false) {
                const backendMessage = response?.message || response?.error;
                setError(backendMessage || "Registration failed");
                return;
            }

            setMessage(response?.message || "User created successfully");

            console.log(
                "Signup response:",
                response
            );

            navigate("/login");

        } catch (error) {
            console.error("Signup error:", error);

            const backendError =
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                error?.message ||
                "Registration failed";

            setError(
                typeof backendError === "string"
                    ? backendError
                    : "Registration failed"
            );
        } finally {

            setLoading(false);
        }

    };


    return (
        <div className="min-h-screen bg-[#0B1114] flex flex-col items-center justify-center px-4 py-8 selection:bg-[#35E9A0]/30 selection:text-white">
            
            {/* FinTrack Brand Header */}
            <Link to="/" className="flex items-center gap-2.5 mb-6 group">
                <div className="flex items-end gap-1 h-6">
                    <span className="w-1.5 h-3 bg-[#35E9A0] rounded-full shadow-[0_0_8px_rgba(53,233,160,0.5)]" />
                    <span className="w-1.5 h-4.5 bg-[#35E9A0] rounded-full shadow-[0_0_10px_rgba(53,233,160,0.6)]" />
                    <span className="w-1.5 h-6 bg-[#35E9A0] rounded-full shadow-[0_0_12px_rgba(53,233,160,0.7)]" />
                </div>
                <span className="text-xl font-bold tracking-tight text-[#F1F5F4] group-hover:text-white transition">
                    FinTrack
                </span>
            </Link>

            <div className="w-full max-w-[360px]">

                {/* =========================
                    MAIN CARD
                ========================== */}
                <div className="bg-[#121E22] border border-[#24363B] rounded-2xl shadow-2xl p-6 sm:p-7">

                    {/* Top Navigation Switcher */}
                    <div className="flex items-center gap-1.5 mb-6 bg-[#101A1D] p-1 rounded-xl border border-[#24363B]">
                        <Link
                            to="/login"
                            className="flex-1 h-9 flex items-center justify-center rounded-lg text-[#A5B4B8] text-xs sm:text-sm font-medium hover:text-[#F1F5F4] hover:bg-[#18272C]/50 transition"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="flex-1 h-9 flex items-center justify-center rounded-lg bg-[#18272C] text-[#F1F5F4] text-xs sm:text-sm font-semibold shadow-xs border border-[#24363B] transition"
                        >
                            Sign Up
                        </Link>
                    </div>

                    {/* ERROR / MESSAGE */}
                    {message && (
                        <div className="mb-4 rounded-xl bg-[#35E9A0]/15 border border-[#35E9A0]/30 px-3.5 py-2.5">
                            <p className="text-xs font-medium text-[#35E9A0] text-center">
                                {message}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 rounded-xl bg-[#FF667A]/15 border border-[#FF667A]/30 px-3.5 py-2.5">
                            <p className="text-xs font-medium text-[#FF667A]">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* SIGNUP FORM */}
                    <form onSubmit={handleSubmit} className="space-y-3.5">

                        {/* FULL NAME */}
                        <div>
                            <label htmlFor="name" className="block text-xs font-medium text-[#A5B4B8] mb-1">
                                Full name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full h-9.5 px-3 text-sm bg-[#18272C] border border-[#24363B] text-[#F1F5F4] rounded-xl outline-none transition placeholder:text-[#71848A] focus:border-[#35E9A0] focus:ring-1 focus:ring-[#35E9A0]/25"
                            />
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-[#A5B4B8] mb-1">
                                Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                                className="w-full h-9.5 px-3 text-sm bg-[#18272C] border border-[#24363B] text-[#F1F5F4] rounded-xl outline-none transition placeholder:text-[#71848A] focus:border-[#35E9A0] focus:ring-1 focus:ring-[#35E9A0]/25"
                            />
                        </div>

                        {/* OCCUPATION */}
                        <div>
                            <label htmlFor="occupation" className="block text-xs font-medium text-[#A5B4B8] mb-1">
                                Occupation
                            </label>
                            <select
                                id="occupation"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                className="w-full h-9.5 px-3 text-sm bg-[#18272C] border border-[#24363B] text-[#F1F5F4] rounded-xl outline-none transition focus:border-[#35E9A0] focus:ring-1 focus:ring-[#35E9A0]/25"
                            >
                                <option value="student" className="bg-[#18272C] text-[#F1F5F4]">Student</option>
                                <option value="employed" className="bg-[#18272C] text-[#F1F5F4]">Employed</option>
                                <option value="unemployed" className="bg-[#18272C] text-[#F1F5F4]">Unemployed</option>
                            </select>
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-[#A5B4B8] mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Create password (6+ chars)"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                                className="w-full h-9.5 px-3 text-sm bg-[#18272C] border border-[#24363B] text-[#F1F5F4] rounded-xl outline-none transition placeholder:text-[#71848A] focus:border-[#35E9A0] focus:ring-1 focus:ring-[#35E9A0]/25"
                            />
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-xs font-medium text-[#A5B4B8] mb-1">
                                Confirm password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Re-enter password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                                className="w-full h-9.5 px-3 text-sm bg-[#18272C] border border-[#24363B] text-[#F1F5F4] rounded-xl outline-none transition placeholder:text-[#71848A] focus:border-[#35E9A0] focus:ring-1 focus:ring-[#35E9A0]/25"
                            />
                        </div>

                        {/* CREATE ACCOUNT BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] text-sm font-bold shadow-[0_0_20px_rgba(53,233,160,0.3)] hover:shadow-[0_0_25px_rgba(53,233,160,0.5)] disabled:opacity-60 disabled:cursor-not-allowed transition duration-200 mt-2"
                        >
                            {loading ? "Creating account..." : "Create an account"}
                        </button>

                    </form>

                    {/* DIVIDER */}
                    <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-[#24363B]" />
                        <span className="text-[11px] font-medium text-[#71848A]">OR</span>
                        <div className="flex-1 h-px bg-[#24363B]" />
                    </div>

                    {/* SOCIAL LOGIN */}
                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
                        }}
                        className="w-full h-10 border border-[#24363B] hover:border-[#35E9A0]/40 bg-[#18272C] hover:bg-[#203238] rounded-xl text-xs sm:text-sm font-medium text-[#F1F5F4] transition flex items-center justify-center gap-2"
                    >
                        <span className="font-bold text-sm">G</span>
                        Continue with Google
                    </button>

                </div>

                {/* LOGIN FOOTER */}
                <div className="bg-[#101A1D] border border-[#24363B] border-t-0 rounded-b-2xl px-6 py-3.5 text-center">
                    <p className="text-xs text-[#A5B4B8]">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-[#35E9A0] hover:underline">
                            Login
                        </Link>
                    </p>
                </div>

            </div>

        </div>

    )
}

export default Signup;