import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { getStoreUser } from "../services/authService";

const ProtectedRoutes = () => {
    const { user, loading } = useAuth();
    const storedUser = user || getStoreUser();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B1114] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#35E9A0] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!storedUser) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
