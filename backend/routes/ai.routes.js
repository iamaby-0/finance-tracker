const aiController = require("../controllers/ai.controller");
const authMiddleware = require('../middlewares/auth.middlewares');

const routes = (app) => {
    // Generate AI Financial Insights dashboard data
    app.get(
        '/aft/api/v1/ai/financial-insights',
        authMiddleware.isAuthenticated,
        aiController.FinancialInsights
    );

    // AI Finance Assistant Chat
    app.post(
        '/aft/api/v1/ai/chat',
        authMiddleware.isAuthenticated,
        aiController.AIChat
    );

    // Chat conversation history
    app.get(
        '/aft/api/v1/ai/chat/history',
        authMiddleware.isAuthenticated,
        aiController.GetChatHistory
    );

    // Clear chat conversation history
    app.delete(
        '/aft/api/v1/ai/chat/clear',
        authMiddleware.isAuthenticated,
        aiController.ClearChatHistory
    );
};

module.exports = routes;