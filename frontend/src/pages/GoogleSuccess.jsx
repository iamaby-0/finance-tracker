import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import api from "../services/api";

const GoogleSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const processedRef = useRef(false);
    const [statusText, setStatusText] = useState("Signing you in with Google...");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (processedRef.current) return;
        processedRef.current = true;

        const finishGoogleLogin = async () => {
            const errorParam = searchParams.get('error');
            if (errorParam) {
                console.error("Google login error param:", errorParam);
                setIsError(true);
                setStatusText(decodeURIComponent(errorParam));
                setTimeout(() => {
                    navigate('/signin', { replace: true });
                }, 2000);
                return;
            }

            const token = searchParams.get('token');
            const email = searchParams.get('email');
            const userParam = searchParams.get('user');

            if (!token || (!email && !userParam)) {
                console.error("Missing token or user credentials in Google callback params");
                setIsError(true);
                setStatusText("Missing authentication parameters. Redirecting to sign in...");
                setTimeout(() => {
                    navigate('/signin', { replace: true });
                }, 1500);
                return;
            }

            try {
                let userData = null;

                // 1. Instant hydration: parse user payload passed securely from callback
                if (userParam) {
                    try {
                        const decodedJson = atob(userParam);
                        userData = JSON.parse(decodedJson);
                    } catch (parseErr) {
                        console.warn("Could not parse user param, falling back to API fetch:", parseErr);
                    }
                }

                // 2. Fallback: Query backend API if userData was not provided in callback query
                if (!userData || (!userData._id && !userData.id)) {
                    // Seed token in localStorage so Axios interceptor includes it automatically
                    localStorage.setItem("token", token);

                    const response = await api.post(
                        '/user/email',
                        { email: (email || "").toLowerCase().trim() },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "x-access-token": token,
                            },
                        }
                    );

                    userData = response.data?.data || response.data?.user || response.data;
                }

                if (!userData || (!userData._id && !userData.id)) {
                    throw new Error("User details not found in API response");
                }

                // Store both user and token in session state
                login(userData, token);
                setStatusText("Welcome! Redirecting to dashboard...");

                // Navigate immediately to authenticated dashboard
                navigate("/dashboard", { replace: true });
            } catch (error) {
                console.error("Google login failed:", error);
                const msg = error.response?.data?.message || error.response?.data?.error || error.message || "Authentication failed";
                setIsError(true);
                setStatusText(`Google Sign-In failed: ${typeof msg === 'string' ? msg : 'Please try again'}`);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setTimeout(() => {
                    navigate("/signin", { replace: true });
                }, 2000);
            }
        };

        finishGoogleLogin();
    }, [navigate, searchParams, login]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B1114] text-[#F1F5F4] p-4">
            <div className="flex flex-col items-center gap-3 text-center max-w-sm">
                {!isError ? (
                    <>
                        <div className="w-8 h-8 border-2 border-[#24363B] border-t-[#35E9A0] rounded-full animate-spin" />
                        <p className="text-sm font-medium text-[#A5B4B8]">
                            {statusText}
                        </p>
                    </>
                ) : (
                    <>
                        <div className="w-10 h-10 rounded-full bg-[#FF667A]/20 text-[#FF667A] flex items-center justify-center font-bold text-lg">
                            !
                        </div>
                        <p className="text-sm font-semibold text-[#FF667A]">
                            {statusText}
                        </p>
                        <p className="text-xs text-[#71848A]">
                            Redirecting to sign in...
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default GoogleSuccess;
