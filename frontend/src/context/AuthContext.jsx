import { createContext, useEffect, useState } from "react";
import { getStoreUser, logoutUser } from "../services/authService";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storeUser = getStoreUser();

        if (storeUser) {
            setUser(storeUser);
        }

        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem("token", token);


        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData)
    }


    const updateUser = (newUserData) => {
        const merged = { ...user, ...newUserData };
        localStorage.setItem("user", JSON.stringify(merged));
        setUser(merged);
    };

    const logout = () => {
        logoutUser();
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{ user, login, logout, updateUser, loading }}
        >
            {children}
        </AuthContext.Provider>
    )
}