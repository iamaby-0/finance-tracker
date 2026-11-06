const analyticsService = require('../services/analytics.service');
const { successResponseBody, errorResponseBody } = require('../utils/responseBody');

const getMonthlySummary = async (req, res) => {
    try {
        const currentDate = new Date();
        const month = parseInt(req.query.month || req.body?.month) || (currentDate.getMonth() + 1);
        const year = parseInt(req.query.year || req.body?.year) || currentDate.getFullYear();

        const summary = await analyticsService.getMonthlySummary(
            req.user.id,
            month,
            year
        );

        return res.status(200).json({
            ...successResponseBody,
            data: summary,
            message: "Monthly Summary fetched successfully"
        });
    }
    catch (error) {
        console.error("getMonthlySummary error:", error);
        return res.status(500).json({
            ...errorResponseBody,
            error: error.message || error,
            message: "Failed to fetch monthly summary"
        });
    }
};

const getCatogarySpend = async (req, res) => {
    try {
        const currentDate = new Date();
        const month = parseInt(req.query.month || req.body?.month) || (currentDate.getMonth() + 1);
        const year = parseInt(req.query.year || req.body?.year) || currentDate.getFullYear();

        const response = await analyticsService.getCategorySpending(
            req.user.id,
            month,
            year
        );

        return res.status(200).json({
            ...successResponseBody,
            data: response,
            message: "Successfully categorised by month & year"
        });
    }
    catch (error) {
        console.error("getCatogarySpend error:", error);
        return res.status(500).json({
            ...errorResponseBody,
            error: error.message || error,
            message: "Failed to fetch category spending"
        });
    }
};

const getMonthlyTrend = async (req, res) => {
    try {
        const year = parseInt(req.query.year || req.body?.year) || new Date().getFullYear();

        const response = await analyticsService.getMonthlytrend(
            req.user.id,
            year
        );

        return res.status(200).json({
            ...successResponseBody,
            data: response,
            message: "Successfully fetched trends"
        });
    }
    catch (error) {
        console.error("getMonthlyTrend error:", error);
        return res.status(500).json({
            ...errorResponseBody,
            error: error.message || error,
            message: "Failed to fetch monthly trends"
        });
    }
};

const getBudgetStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const status = await analyticsService.getBudgetStatus(
            userId,
            id
        );

        if (status.error) {
            return res.status(status.code || 400).json({
                ...errorResponseBody,
                error: status.error,
                message: status.error
            });
        }

        return res.status(200).json({
            ...successResponseBody,
            data: status,
            message: "Successfully fetched budget status"
        });
    } catch (error) {
        console.error("getBudgetStatus error:", error);
        return res.status(500).json({
            ...errorResponseBody,
            error: error.message || error,
            message: "Failed to fetch budget status"
        });
    }
};

const getUnusualSpending = async (req, res) => {
    try {
        const userId = req.user.id;
        const currentDate = new Date();
        const month = Number(req.query.month) || (currentDate.getMonth() + 1);
        const year = Number(req.query.year) || currentDate.getFullYear();

        const alerts = await analyticsService.getUnusualSpending(userId, month, year);

        return res.status(200).json({
            ...successResponseBody,
            data: alerts,
            message: "Successfully fetched unusual spending"
        });
    }
    catch (error) {
        console.error("getUnusualSpending error:", error);
        return res.status(500).json({
            ...errorResponseBody,
            error: error.message || error,
            message: "Failed to fetch unusual spending"
        });
    }
};

const getSavingsPrediction = async (req, res) => {
    try {
        const response = await analyticsService.getSavingsPrediction(req.user.id);

        return res.status(200).json({
            ...successResponseBody,
            data: response,
            message: "Savings prediction generated successfully"
        });
    }
    catch (error) {
        console.error("getSavingsPrediction error:", error);
        return res.status(500).json({
            ...errorResponseBody,
            error: error.message || error,
            message: "Failed to generate savings prediction"
        });
    }
};

module.exports = {
    getMonthlySummary,
    getCatogarySpend,
    getMonthlyTrend,
    getBudgetStatus,
    getUnusualSpending,
    getSavingsPrediction
};
