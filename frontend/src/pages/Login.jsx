import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import useAuth from "../hooks/useAuth";
import { loginUser } from "../services/authService";

function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await loginUser(formData);

            console.log("Login response:", response);

            /*
             * Based on your backend response:
             *
             * {
             *   success: true,
             *   data: {
             *      token: "...",
             *      user: {...}
             *   }
             * }
             *
             * If your response is different,
             * adjust these two lines.
             */

            const token = response.token;
            const user = response.data;

            login(user, token);

            navigate("/");

        } catch (error) {

            console.error("Login error:", error);

            setError(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4">

            <div className="w-full max-w-[340px]">

                {/* =========================
                    MAIN CARD
                ========================== */}

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">


                    {/* =========================
                        TOP NAVIGATION
                    ========================== */}

                    {/* Top Navigation */}

                    <div className="flex items-center gap-2 mb-8 bg-gray-100 p-1 rounded-lg">

                        {/* Login */}

                        <Link
                            to="/login"
                            className="
                                        flex-1
                                        h-9
                                        flex
                                        items-center
                                        justify-center
                                        rounded-md
                                        bg-white
                                        text-gray-900
                                        text-sm
                                        font-medium
                                        shadow-sm
                                        border
                                        border-gray-200
                                        transition
                                    "
                        >
                            Login
                        </Link>


                        {/* Sign Up */}

                        <Link
                            to="/signup"
                            className="
                                        flex-1
                                        h-9
                                        flex
                                        items-center
                                        justify-center
                                        rounded-md
                                        text-gray-500
                                        text-sm
                                        font-medium
                                        hover:bg-white
                                        hover:text-gray-900
                                        transition
                                    "
                        >
                            Sign Up
                        </Link>

                    </div>


                    {/* =========================
                        ERROR
                    ========================== */}

                    {error && (

                        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2">

                            <p className="text-sm text-red-600">
                                {error}
                            </p>

                        </div>

                    )}


                    {/* =========================
                        LOGIN FORM
                    ========================== */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* EMAIL */}

                        <div>

                            <label
                                htmlFor="email"
                                className="block text-xs font-medium text-gray-700 mb-2"
                            >
                                Email address
                            </label>


                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                                className="
                                    w-full
                                    h-10
                                    px-3
                                    text-sm
                                    border
                                    border-gray-300
                                    rounded-lg
                                    outline-none
                                    transition
                                    placeholder:text-gray-400
                                    focus:border-gray-500
                                    focus:ring-1
                                    focus:ring-gray-300
                                "
                            />

                        </div>


                        {/* PASSWORD */}

                        <div>

                            <div className="flex justify-between items-center mb-2">

                                <label
                                    htmlFor="password"
                                    className="text-xs font-medium text-gray-700"
                                >
                                    Password
                                </label>


                                <Link
                                    to="/forgot-password"
                                    className="text-xs text-gray-600 hover:text-black transition"
                                >
                                    Forgot password?
                                </Link>

                            </div>


                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                                className="
                                    w-full
                                    h-10
                                    px-3
                                    text-sm
                                    border
                                    border-gray-300
                                    rounded-lg
                                    outline-none
                                    transition
                                    placeholder:text-gray-400
                                    focus:border-gray-500
                                    focus:ring-1
                                    focus:ring-gray-300
                                "
                            />

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                h-10
                                rounded-lg
                                bg-[#171a20]
                                text-white
                                text-sm
                                font-medium
                                hover:bg-[#292d35]
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                                transition
                            "
                        >

                            {loading
                                ? "Logging in..."
                                : "Log In"
                            }

                        </button>

                    </form>


                    {/* =========================
                        DIVIDER
                    ========================== */}

                    <div className="flex items-center gap-3 my-6">

                        <div className="flex-1 h-px bg-gray-200" />

                        <span className="text-xs text-gray-400">
                            OR
                        </span>

                        <div className="flex-1 h-px bg-gray-200" />

                    </div>


                    {/* =========================
                        SOCIAL LOGIN
                    ========================== */}

                    <div className="space-y-3">

                        {/* GOOGLE */}

                        <button
                            type="button"
                            className="
                                w-full
                                h-10
                                border
                                border-gray-300
                                rounded-lg
                                text-sm
                                font-medium
                                hover:bg-gray-50
                                transition
                            "
                        >

                            <span className="mr-2 font-bold">
                                G
                            </span>

                            Continue with Google

                        </button>


                        {/* APPLE */}

                        <button
                            type="button"
                            className="
                                w-full
                                h-10
                                border
                                border-gray-300
                                rounded-lg
                                text-sm
                                font-medium
                                hover:bg-gray-50
                                transition
                            "
                        >

                            <span className="mr-2">
                                ●
                            </span>

                            Continue with Apple

                        </button>


                        {/* BINANCE */}

                        <button
                            type="button"
                            className="
                                w-full
                                h-10
                                border
                                border-gray-300
                                rounded-lg
                                text-sm
                                font-medium
                                hover:bg-gray-50
                                transition
                            "
                        >

                            <span className="mr-2">
                                ◆
                            </span>

                            Continue with Binance

                        </button>


                        {/* WALLET */}

                        <button
                            type="button"
                            className="
                                w-full
                                h-10
                                border
                                border-gray-300
                                rounded-lg
                                text-sm
                                font-medium
                                hover:bg-gray-50
                                transition
                            "
                        >

                            <span className="mr-2">
                                ▣
                            </span>

                            Continue with Wallet

                        </button>

                    </div>

                </div>


                {/* =========================
                    SIGNUP FOOTER
                ========================== */}

                <div
                    className="
                        bg-white
                        border
                        border-gray-200
                        border-t-0
                        rounded-b-xl
                        px-6
                        py-4
                        text-center
                    "
                >

                    <p className="text-xs text-gray-500">

                        Don't have an account?{" "}

                        <Link
                            to="/signup"
                            className="
                                font-medium
                                text-gray-900
                                underline
                                hover:no-underline
                            "
                        >
                            Sign up
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;