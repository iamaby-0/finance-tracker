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

module.exports = {
    createExpense
}