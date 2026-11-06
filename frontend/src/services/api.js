import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_URL || "https://finance-tracker-m46z.onrender.com/aft/api/v1";
const baseURL = rawBaseURL.replace(/\/+$/, "");

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.headers["x-access-token"] = token;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            error.response.status === 401 &&
            !error.config?.url?.includes("/auth/signin") &&
            !error.config?.url?.includes("/auth/signup") &&
            !error.config?.url?.includes("/auth/google") &&
            !error.config?.url?.includes("/user/email")
        ) {
            console.warn("Session expired or unauthorized request. Clearing session.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        return Promise.reject(error);
    }
);

export default api;
