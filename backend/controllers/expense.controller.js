const expenseService = require('../services/expense.service')
const {errorResponseBody, successResponseBody} = require('../utils/responseBody')

const createExp = async(req, res)=>{
    try{
        const userId = req.user.id;
        const response = await expenseService.createExpense(userId, req.body)

        if(response.error){
            errorResponseBody.error = response.error;
            return res.status(response.code).json(errorResponseBody)
        }
        successResponseBody.data = response
        successResponseBody.message = "Exprense added successfully"

        return res.status(201).json(successResponseBody);
    }
    catch(error){
        errorResponseBody.error = error;
        return  res.status(500).json(errorResponseBody)
    }
}

const getAllExpernses = async(req, res)=>{
    try{
        const userId = req.user.id
        const response = await expenseService.getExpenses(userId);

        successResponseBody.data = response
        successResponseBody.message = "Successfully fetch all expenses"

        return res.status(200).json(successResponseBody)
    }
    catch(error){
        errorResponseBody.error = error

        return res.status(500).json(errorResponseBody);
    }
}

const getExpenseByid = async(req, res)=>{
    try{
        const response = await expenseService.getExpenseById(req.params.id);

        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched expense by id"

        return res.status(200).json(successResponseBody)
    }
    catch(error){
        errorResponseBody.error = error;

        return res.status(500).json(errorResponseBody)

    }
}

const updateExpense = async(req, res)=>{
    try{
        const response = await expenseService.updateExpense(req.params.id, req.body);

        if(response.error){
            errorResponseBody.error=response.error
            return res.status(response.code).json(errorResponseBody)
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully Update Expense"

        return res.status(200).json(successResponseBody);
    }
    catch(error){
        errorResponseBody.error = error;

        return res.status(500).json(errorResponseBody);
    }
}

const deleteEX = async(req, res)=>{
    try{
        const response = await expenseService.deleteExpense(req.params.id)

        if(response.error){
            errorResponseBody.error=response.error
            return res.status(response.code).json(errorResponseBody)
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully deleted Expense"

        return res.status(200).json(successResponseBody);
    }
    catch(error){
        errorResponseBody.error = error;

        return res.status(500).json(errorResponseBody);
    }
}

module.exports = {
    createExp,
    getAllExpernses,
    getExpenseByid,
    updateExpense,
    deleteEX
}