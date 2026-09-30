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

        if (!userId || !year) {
            throw {
                error: "userID or Year not found , unable fetch trends",
                code: 404
            }
        }

        const result = await Expense.aggregate([
            {
                $match: {
                    userId: userObjectId,
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

const getBudgetStatus = async (userId, budgetId) => {
    try {

        const userObjectId = new ObjectId(userId);
        const budget = await Budget.findOne({
            budgetId,
            userId: userObjectId
        });


        if (!budget) {
            return {
                error: "budget not found , invalid id", code: 404
            }
        }


        const startDate = new Date(
            budget.year,
            budget.month - 1,
            1
        );

        const endDate = new Date(
            budget.year,
            budget.month,
            1
        );


        const match = {
            userId,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        };


        // If category-specific budget
        if (budget.category !== "Overall") {
            match.category = budget.category;
        }


        const result = await Expense.aggregate([
            {
                $match: match
            },

            {
                $group: {
                    _id: null,
                    spent: {
                        $sum: "$amount"
                    }
                }
            }
        ]);


        const spent = result[0]?.spent || 0;

        const remaining = budget.amount - spent;

        const percentageUsed = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;


        return {
            budget: budget.amount,
            spent,
            remaining,
            percentageUsed:
                Number(percentageUsed.toFixed(2)),
            alert:
                percentageUsed >= budget.alertPercentage,
            exceeded:
                spent > budget.amount
        }
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

// for unusualSpending
const getUnusualSpending = async (userId, month, year) => {
    try {

        const currentStart = new Date(year, month - 1, 1);
        const currentEnd = new Date(year, month, 1);

        const previousStart = new Date(year, month - 4, 1);

        const currentSpending = await Expense.aggregate([
            {
                $match: {
                    userId,
                    date: {
                        $gte: currentStart,
                        $lt: currentEnd
                    }
                }
            },
            {
                $group: {
                    _id: "$category",

                    amount: {
                        $sum: "$amount"
                    }
                }
            }
        ]);


        const previousSpending = await Expense.aggregate([
            {
                $match: {
                    userId,
                    date: {
                        $gte: previousStart,
                        $lt: currentStart
                    }
                }
            },

            {
                $group: {
                    _id: {
                        category: "$category",
                        year: {
                            $year: "$date"
                        },
                        month: {
                            $month: "$date"
                        }
                    },

                    amount: {
                        $sum: "$amount"
                    }
                }
            }
        ]);


        let alerts = [];

        for (const current of currentSpending) {

            const category =
                current._id;

            const currentAmount =
                current.amount;


            // Find previous monthly values
            const previousValues =
                previousSpending
                    .filter(
                        item =>
                            item._id.category === category
                    )
                    .map(
                        item => item.amount
                    );


            // No historical data
            if (previousValues.length === 0) {
                continue;
            }


            const average =
                previousValues.reduce(
                    (sum, value) =>
                        sum + value,
                    0
                ) / previousValues.length;


            if (average === 0) {
                continue;
            }


            const increasePercentage =
                (
                    (currentAmount - average) /
                    average
                ) * 100;


            // 50% higher than historical average
            if (increasePercentage >= 50) {

                alerts.push({

                    category,

                    currentSpending:
                        Number(
                            currentAmount.toFixed(2)
                        ),

                    averageSpending:
                        Number(
                            average.toFixed(2)
                        ),

                    increasePercentage:
                        Number(
                            increasePercentage.toFixed(2)
                        ),

                    unusual: true
                });
            }
        }
        return alerts;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    getMonthlySummary,
    getCategorySpending,
    getMonthlytrend,
    getBudgetStatus,
    getUnusualSpending
}