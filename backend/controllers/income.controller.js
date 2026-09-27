const incomeService = require('../services/income.service')
const { errorResponseBody, successResponseBody } = require('../utils/responseBody')

const createIncome = async (req, res) => {
    try {
        const userId = req.user.id;
        const response = await incomeService.create(userId, req.body)

        if (response.error) {
            errorResponseBody.error = response.error;
            return res.status(response.code).json(errorResponseBody)
        }
        successResponseBody.data = response
        successResponseBody.message = "income added successfully"

        return res.status(201).json(successResponseBody);
    }
    catch (error) {
        errorResponseBody.error = error;
        return res.status(500).json(errorResponseBody)
    }
}

const getIncomeById = async (req, res) => {
    try {
        const response = await incomeService.getIncomeById(req.params.id);

        if (response.error) {
            errorResponseBody.error = response.error;
            return res.status(response.code).json(errorResponseBody)
        }
        successResponseBody.data = response
        successResponseBody.message = "income details fetched successfully"

        return res.status(200).json(successResponseBody)
    }
    catch (error) {
        errorResponseBody.error = error;

        return res.status(500).json(errorResponseBody)
    }
}

const getAllincome = async (req, res) => {
    try {
        const response = await incomeService.getAllIncome(req.user.id);

        if (response.error) {
            errorResponseBody.error = response.error;
            return res.status(response.code).json(errorResponseBody)
        }
        successResponseBody.data = response
        successResponseBody.message = "income details fetched successfully"

        return res.status(200).json(successResponseBody)
    }
    catch (error) {
        errorResponseBody.error = error;

        return res.status(500).json(errorResponseBody)
    }
}

const updateIncome = async (req, res) => {
    try {
        const response = await incomeService.updateIncome(req.params.id, req.body);

        if (response.error) {
            errorResponseBody.error = response.error;
            return res.status(response.code).json(errorResponseBody)
        }
        successResponseBody.data = response
        successResponseBody.message = "income details updated successfully"

        return res.status(200).json(successResponseBody)
    }
    catch (error) {
        errorResponseBody.error = error;

        return res.status(500).json(errorResponseBody)
    }
}


const deleteIncome = async (req, res) => {
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
    createIncome,
    getIncomeById,
    getAllincome,
    deleteIncome,
    updateIncome
}