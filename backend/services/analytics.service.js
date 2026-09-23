const Expense = require("../models/expense.model")
const Income = require('../models/income.model')
const Budget = require('../models/budget.model')
const mongoose = require('mongoose')


// monthaly summary
const getMonthlySummary = async (userId, month, year) => {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const incomeResult = await Income.aggregate([
            {
                $match: {
                    userId : userObjectId,
                    date: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: {
                        $sum: "$amount"
                    }
                }
            }
        ]);


        const expenseResult = await Expense.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    date: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            },

            {
                $group: {
                    _id: null,
                    totalExpenses: {
                        $sum: '$amount'
                    }
                }
            }
        ]);


        const totalIncome = incomeResult[0]?.totalIncome || 0;
        const totalExpenses = expenseResult[0]?.totalExpenses || 0;

        const savings = totalIncome - totalExpenses;

        const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;


        return {
            month,
            year,
            totalIncome,
            totalExpenses,
            savings,
            savingsRate : Number(
                savingsRate.toFixed(2)
            )
        };

    }
    catch(error){
        console.log(error)
        throw error
    }
}


module.exports = {
    getMonthlySummary
}