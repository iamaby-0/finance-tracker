const Expense = require("../models/expense.model")

const createExpense = async(userId, data) =>{
    try{
        const response = await Expense.create({
            userId,
            ...data
        });

        return response;
    }
    catch(error){
        console.log(error);
        if(error.name == "ValidatorError"){
            let err = {};
            Object.keys(error.errors).forEach((keys) => {
                err[keys] = error.errors[keys].message
            });

            throw {
                error : err , code : 400
            }
        }
        throw error;

    }
}

const getExpenses = async(userId)=>{
    try{
        const response = await Expense.find({
            userId
        }).sort({
            date : -1
        });

        
        return response;
        
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

const getExpenseById = async(id)=>{
    try{
        const response = await findOne({id});
        if(!response){
            throw {
                error :"invalid expense id",
                code : 404
            }
        }
        return response
    }
    catch(error){
        console.log(error)
        throw error;
    }
}

module.exports = {
    createExpense,
    getExpenses,
    getExpenseById
}