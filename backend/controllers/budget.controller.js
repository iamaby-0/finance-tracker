const budgetService = require("../services/budget.service");
const { errorResponseBody, successResponseBody } = require("../utils/responseBody");

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
        errorResponseBody.error = error
        return res.status(500).json(errorResponseBody)
    }
}
const getBudgets = async (req, res) => {
    try {
        const { month, year, category } = req.query;

        const response = await budgetService.getbudgets(req.user.id, req.query)

        successResponseBody.data = response;
        successResponseBody.message = "Successfully  Fetched the Budgets"

        return res.status(200).json(successResponseBody)

    }
    catch (error) {
        errorResponseBody.error = error;

        return res.status(500).json(errorResponseBody)
    }
}

const getBudgetByid = async (req, res) => {
    try {
        const response = await expenseService.getBudgetByid(req.params.id);

        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched Budget by id"

        return res.status(200).json(successResponseBody)
    }
    catch (error) {
        errorResponseBody.error = error;

        return res.status(500).json(errorResponseBody)

    }
}

const updateBudget = async (req, res) => {
    try {
        const response = await expenseService.updateBudget(req.params.id, req.body);

        if (response.error) {
            errorResponseBody.error = response.error
            return res.status(response.code).json(errorResponseBody)
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully Updated budget"

        return res.status(200).json(successResponseBody);
    }
    catch (error) {
        errorResponseBody.error = error;

        return res.status(500).json(errorResponseBody);
    }
}


const deleteBudget = async (req, res) => {
    try {
        const response = await incomeService.deleteIncome(req.params.id);

        if (response.error) {
            errorResponseBody.error = response.error;
            return res.status(response.code).json(errorResponseBody)
        }
        successResponseBody.data = response
        successResponseBody.message = "income details deleted successfully"

        return res.status(200).json(successResponseBody)
    }
    catch (error) {
        errorResponseBody.error = error;

        return res.status(500).json(errorResponseBody)
    }
}
module.exports = {
    createBudget,
    getBudgets,
    getBudgetByid,
    updateBudget,
    deleteBudget

}