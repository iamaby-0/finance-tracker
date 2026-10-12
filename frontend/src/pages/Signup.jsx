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

        <div className="
            min-h-screen
            bg-[#f7f7f7]
            flex
            items-center
            justify-center
            px-4
        ">

            <div className="w-full max-w-[340px]">


                {/* =========================
                    MAIN CARD
                ========================== */}

                <div className="
                    bg-white
                    border
                    border-gray-200
                    rounded-xl
                    shadow-sm
                    p-6
                ">


                    {/* =========================
                        LOGIN / SIGNUP BUTTONS
                    ========================== */}

                    <div className="
                        flex
                        justify-center
                        gap-3
                        mb-8
                    ">

                        {/* LOGIN */}

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
                                text-gray-700
                                border
                                border-gray-300
                                text-sm
                                font-medium
                                hover:bg-gray-50
                                transition
                            "
                        >
                            Login
                        </Link>


                        {/* SIGN UP */}

                        <Link
                            to="/signup"
                            className="
                                flex-1
                                h-9
                                flex
                                items-center
                                justify-center
                                rounded-md
                                bg-[#171a20]
                                text-white
                                border
                                border-[#171a20]
                                text-sm
                                font-medium
                                transition
                            "
                        >
                            Sign Up
                        </Link>

                    </div>


                    {/* =========================
                        ERROR
                    ========================== */}

                    {message && (
                        <p className="mb-4 text-center text-green-600">
                            {message}
                        </p>
                    )}

                    {error && (

                        <div className="
                            mb-4
                            rounded-lg
                            bg-red-50
                            border
                            border-red-200
                            px-3
                            py-2
                        ">

                            <p className="
                                text-sm
                                text-red-600
                            ">
                                {error}
                            </p>

                        </div>

                    )}


                    {/* =========================
                        SIGNUP FORM
                    ========================== */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >


                        {/* NAME */}

                        <div>

                            <label
                                htmlFor="name"
                                className="
                                    block
                                    text-xs
                                    font-medium
                                    text-gray-700
                                    mb-2
                                "
                            >
                                Full name
                            </label>


                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
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


                        {/* EMAIL */}

                        <div>

                            <label
                                htmlFor="email"
                                className="
                                    block
                                    text-xs
                                    font-medium
                                    text-gray-700
                                    mb-2
                                "
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


                        {/* ACCOUNT TYPE */}

                        <div>

                            <label
                                htmlFor="occupation"
                                className="
                                    block
                                    text-xs
                                    font-medium
                                    text-gray-700
                                    mb-2
                                "
                            >
                                Occupation
                            </label>


                            <select
                                id="occupation"
                                name="occupation"
                                value={
                                    formData.occupation
                                }
                                onChange={
                                    handleChange
                                }
                                className="
                                    w-full
                                    h-10
                                    px-3
                                    text-sm
                                    border
                                    border-gray-300
                                    rounded-lg
                                    outline-none
                                    bg-white
                                    text-gray-700
                                    focus:border-gray-500
                                    focus:ring-1
                                    focus:ring-gray-300
                                "
                            >

                                <option value="student">
                                    Student
                                </option>

                                <option value="employed">
                                    Employed
                                </option>

                                <option value="unemployed">
                                    Unemployed
                                </option>

                            </select>

                        </div>


                        {/* PASSWORD */}

                        <div>

                            <label
                                htmlFor="password"
                                className="
                                    block
                                    text-xs
                                    font-medium
                                    text-gray-700
                                    mb-2
                                "
                            >
                                Password
                            </label>


                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Create a password"
                                value={
                                    formData.password
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="new-password"
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


                        {/* CONFIRM PASSWORD */}

                        <div>

                            <label
                                htmlFor="confirmPassword"
                                className="
                                    block
                                    text-xs
                                    font-medium
                                    text-gray-700
                                    mb-2
                                "
                            >
                                Confirm password
                            </label>


                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="new-password"
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


                        {/* CREATE ACCOUNT */}

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
                                ? "Creating account..."
                                : "Create an account"
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
                            onClick={()=>{
                                window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
                            }}
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

                    </div>

                </div>



                {/* =========================
                    LOGIN FOOTER
                ========================== */}

                <div className="
                    bg-white
                    border
                    border-gray-200
                    border-t-0
                    rounded-b-xl
                    px-6
                    py-4
                    text-center
                ">

                    <p className="
                        text-xs
                        text-gray-500
                    ">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="
                                font-medium
                                text-gray-900
                                underline
                                hover:no-underline
                            "
                        >
                            Login
                        </Link>

                    </p>

                </div>

            </div>


        </div>

    )
}

export default Signup;