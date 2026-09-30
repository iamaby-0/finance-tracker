const Expense = require("../models/expense.model")
const {categorizeExpense} = require("./ai/ai.service") 

const createExpense = async(userId, data) =>{
    try{
        const { amount , description, category ,paymentMethod, subCategory, date, notes} = data;

        let finalCategory = category;
        let finalSubCategory = subCategory;

        let aiCategorized = false;
        let aiConfidence = null;

        if(!category){
            const aiResult = await categorizeExpense(description, amount);

            finalCategory = aiResult.category;
            finalSubCategory = aiResult.subCategory;
            
            aiCategorized = true;

            aiConfidence = aiResult.confidence;
        }

        const response = await Expense.create({
            userId,
            amount,
            description,
            category : finalCategory,
            subCategory : finalSubCategory,
            paymentMethod,
            date,
            notes,
            aiCategorized,
            aiConfidence
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
        const response = await Expense.findOne({id});
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

const updateExpense = async(id, newData) =>{
    try{
        const response = await Expense.findByIdAndUpdate(
            id, 
            {$set : newData},
            {
                returnDocument : 'after',
                runValidators : true
            }
        )

        if(!response){
            throw {
                error :"invalid id , cannot find expense",
                code : 404
            }
        }

        return response;
    }
    catch(error){
        console.log(error)
        throw error
    }
}

const deleteExpense = async(id)=>{
    try{
        const response = await Expense.findByIdAndDelete(id)

        if(!response){
            throw {
                error : "invalid id , cannot find expense",
                code :404
            }
        }

        return response;
    }
    catch(error){
        console.log(error)
        throw error
    }
}

module.exports = {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
}