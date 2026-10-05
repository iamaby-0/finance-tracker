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


    const logout = () => {
        logoutUser();
        logoutUser(null);
    }

    return (
        <AuthContext.Provider
            value={{ user, login, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    )
}