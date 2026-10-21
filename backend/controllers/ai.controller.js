const aiService = require("../services/ai/ai.service");
const { successResponseBody, errorResponseBody } = require("../utils/responseBody");

const FinancialInsights = async (req, res) => {
    try {
        const userId = req.user.id;
        const period = req.query.period || 'This Month';

        const response = await aiService.generateFinancialInsights(userId, period);

        const responseBody = {
            ...successResponseBody,
            data: response,
            message: 'Financial insights generated successfully'
        };

        return res.status(200).json(responseBody);
    } catch (error) {
        console.error("FinancialInsights controller error:", error);
        const errBody = {
            ...errorResponseBody,
            error: error.message || error,
            message: 'Failed to generate financial insights'
        };
        return res.status(500).json(errBody);
    }
};

const AIChat = async (req, res) => {
    try {
        const userId = req.user.id;
        const { message, conversationId, period, history } = req.body;

        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({
                ...errorResponseBody,
                message: 'Message is required'
            });
        }

        const chatResponse = await aiService.aiChat(userId, {
            message: message.trim(),
            conversationId,
            period,
            history
        });

        const responseBody = {
            ...successResponseBody,
            data: chatResponse,
            message: 'AI response generated successfully'
        };

        return res.status(200).json(responseBody);
    } catch (error) {
        console.error("AIChat controller error:", error);
        const errBody = {
            ...errorResponseBody,
            error: error.message || error,
            message: 'Failed to process AI chat request'
        };
        return res.status(500).json(errBody);
    }
};

const GetChatHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversationId = req.query.conversationId;

        const history = await aiService.getChatHistory(userId, conversationId);

        return res.status(200).json({
            ...successResponseBody,
            data: history,
            message: 'Chat history retrieved successfully'
        });
    } catch (error) {
        console.error("GetChatHistory controller error:", error);
        return res.status(500).json({
            ...errorResponseBody,
            error: error.message || error,
            message: 'Failed to retrieve chat history'
        });
    }
};

const ClearChatHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversationId = req.query.conversationId;

        await aiService.clearChatHistory(userId, conversationId);

        return res.status(200).json({
            ...successResponseBody,
            data: { cleared: true },
            message: 'Chat history cleared successfully'
        });
    } catch (error) {
        console.error("ClearChatHistory controller error:", error);
        return res.status(500).json({
            ...errorResponseBody,
            error: error.message || error,
            message: 'Failed to clear chat history'
        });
    }
};

module.exports = {
    FinancialInsights,
    AIChat,
    GetChatHistory,
    ClearChatHistory
};