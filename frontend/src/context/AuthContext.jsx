import { createContext, useEffect, useState, useCallback } from "react";
import { getStoreUser, logoutUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize synchronously from localStorage so there is zero latency/unauthenticated flicker
    const [user, setUser] = useState(() => getStoreUser());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Sync state if another tab modifies storage or on re-mount
        const handleStorageChange = (e) => {
            if (e.key === "user") {
                try {
                    setUser(e.newValue ? JSON.parse(e.newValue) : null);
                } catch {
                    setUser(null);
                }
            } else if (e.key === "token" && !e.newValue) {
                setUser(null);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const login = useCallback((userData, token) => {
        if (!userData || !token) {
            console.error("login called with invalid userData or token", { userData, hasToken: !!token });
            return;
        }
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    }, []);

    const updateUser = useCallback((newUserData) => {
        setUser((prevUser) => {
            const merged = { ...prevUser, ...newUserData };
            localStorage.setItem("user", JSON.stringify(merged));
            return merged;
        });
    }, []);

    const logout = useCallback(() => {
        logoutUser();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, login, logout, updateUser, loading, isAuthenticated: !!user }}
        >
            {children}
        </AuthContext.Provider>
    );
};
