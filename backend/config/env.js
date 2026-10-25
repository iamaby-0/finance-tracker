const dotenv = require("dotenv")
dotenv.config();

const config = {
    port: process.env.PORT || 3000,

    db_url: process.env.DB_URL,

    jwtSecret: process.env.JWT_SECRET,
    frontendUrl: process.env.FRONTEND_URL || "https://my-finance-tracker-omega-ten-32.vercel.app",

    groqApiKey: process.env.GROQ_API_KEY
}

module.exports = config;