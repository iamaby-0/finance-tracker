import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useRef } from "react";
import api from "../services/api";

const GoogleSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;
        processedRef.current = true;

        const finishGoogleLogin = async () => {
            const token = searchParams.get('token');
            const email = searchParams.get('email');

            if (!token || !email) {
                console.error("Missing token or email in Google callback params");
                navigate('/signin', { replace: true });
                return;
            }

            try {
                const response = await api.post(
                    '/user/email',
                    { email },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "x-access-token": token,
                        },
                    }
                );

                const userData = response.data?.data || response.data?.user || response.data;

                if (!userData || (!userData._id && !userData.id)) {
                    throw new Error("User details not found in API response");
                }

                login(userData, token);
                navigate("/", { replace: true });
            } catch (error) {
                console.error("Google login failed:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/signin", { replace: true });
            }
        };

        finishGoogleLogin();
    }, [navigate, searchParams, login]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B1114] text-[#F1F5F4] p-4">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#24363B] border-t-[#35E9A0] rounded-full animate-spin" />
                <p className="text-sm font-medium text-[#A5B4B8]">
                    Signing you in with Google...
                </p>
            </div>
        </div>
    );
};

export default GoogleSuccess;