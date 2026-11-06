const dotenv = require("dotenv");
dotenv.config();

const rawFrontendUrl = process.env.FRONTEND_URL;
const isProd = process.env.NODE_ENV === "production" || process.env.RENDER;
const defaultFrontend = "https://my-finance-tracker-omega-ten-32.vercel.app";

const config = {
    port: process.env.PORT || 3000,
    db_url: process.env.DB_URL,
    jwtSecret: process.env.JWT_SECRET || "iamaby",
    frontendUrl: ((isProd && (!rawFrontendUrl || rawFrontendUrl.includes("localhost")))
        ? defaultFrontend
        : (rawFrontendUrl || defaultFrontend)
    ).replace(/\/+$/, ""),
    groqApiKey: process.env.GROQ_API_KEY,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || "https://finance-tracker-m46z.onrender.com/aft/api/v1/auth/google/callback"
};

module.exports = config;
