const dotenv = require("dotenv")
dotenv.config();

const config = {
    port: process.env.PORT || 3000,

    db_url: process.env.DB_URL,

    jwtSecret: process.env.JWT_SECRET,
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",

    groqApiKey: process.env.GROQ_API_KEY
}

module.exports = config;