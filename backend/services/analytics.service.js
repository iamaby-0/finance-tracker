const Expense = require("../models/expense.model")
const Income = require('../models/income.model')
const Budget = require('../models/budget.model')
const ObjectId = require('mongoose').Types.ObjectId


// monthaly summary
const getMonthlySummary = async (userId, month, year) => {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);
        const userObjectId = new ObjectId(userId);

        const incomeResult = await Income.aggregate([
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
            savingsRate: Number(
                savingsRate.toFixed(2)
            )
        };

    }
    catch (error) {
        console.log(error)
        throw error
    }
}

const getCategorySpending = async (userId, month, year) => {
    try {
        const userObjectId = new ObjectId(userId);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const result = await Expense.aggregate([
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
                    _id: "$category",
                    total: {
                        $sum: "$amount"
                    }
                }
            },
            {
                $sort: {
                    total: -1
                }
            }
        ]);

        return result.map(item => ({
            category: item._id,
            amount: item.total
        }))

    } catch (error) {
        console.log(error)
        throw error
    }
}

const getMonthlytrend = async (userId, year) => {
    try {
        const userObjectId = new ObjectId(userId);

        if(!userId || !year){
            throw {
                error : "userID or Year not found , unable fetch trends",
                code : 404
            }
        }
        
        const result = await Expense.aggregate([
            {
                $match: {
                    userId : userObjectId,
                    date: {
                        $gte: new Date(year, 0, 1),
                        $lt: new Date(year + 1, 0, 1)
                    }
                }
            },

            {
                $group: {
                    _id: {
                        month: {
                            $month: "$date"
                        }
                    },

                    total: {
                        $sum: "$amount"
                    }
                }
            },

            {
                $sort: {
                    "_id.month": 1
                }
            }
        ]);


        return result.map(item => ({
            month: item._id.month,
            amount: item.total
        }));
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

module.exports = {
    getMonthlySummary,
    getCategorySpending,
    getMonthlytrend,
}