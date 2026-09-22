const budgetService = require("../services/budget.service");
const { errorResponseBody ,successResponseBody} = require("../utils/responseBody");

const createBudget = async (req, res) => {
    try {
        const userId = req.user.id;
        const response = await budgetService.createBudget(userId, req.body)

        if (response.error) {
            errorResponseBody.error = response.error;
            return res.status(response.code).json(errorResponseBody)
        }
        successResponseBody.data = response
        successResponseBody.message = "budget added successfully"

        return res.status(201).json(successResponseBody);
    }
    catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                code: 409,
                message: "A budget for this category, month, and year already exists."
            });
        }
        errorResponseBody.error =error
        return res.status(500).json(errorResponseBody)
    }
}

module.exports = {
    createBudget
}