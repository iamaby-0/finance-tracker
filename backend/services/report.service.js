const mongoose = require("mongoose");
const Expense = require("../models/expense.model");
const Income = require("../models/income.model");
const Budget = require("../models/budget.model");


const { getUnusualSpending, getSavingsPrediction } = require("./analytics.service");


const getMonthlyReports = async (userId, month, year) => {
    try {
        const userObjectId =
            new mongoose.Types.ObjectId(userId);


        // ==========================================
        // DATE RANGE
        // ==========================================

        const startDate = new Date(
            year,
            month - 1,
            1
        );

        const endDate = new Date(
            year,
            month,
            1
        );


        // ==========================================
        // INCOME
        // ==========================================

        const incomeResult =
            await Income.aggregate([

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


        const totalIncome =
            incomeResult[0]?.totalIncome || 0;


        // ==========================================
        // EXPENSE
        // ==========================================

        const expenseResult =
            await Expense.aggregate([

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

                        totalExpense: {
                            $sum: "$amount"
                        }
                    }
                }
            ]);


        const totalExpense =
            expenseResult[0]?.totalExpense || 0;


        // ==========================================
        // SAVINGS
        // ==========================================

        const savings =
            totalIncome - totalExpense;


        const savingsRate =
            totalIncome > 0
                ? (savings / totalIncome) * 100
                : 0;


        // ==========================================
        // CATEGORY BREAKDOWN
        // ==========================================

        const categoryResult =
            await Expense.aggregate([

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

                        amount: {
                            $sum: "$amount"
                        }
                    }
                },

                {
                    $sort: {
                        amount: -1
                    }
                }
            ]);


        const categoryBreakdown =
            categoryResult.map(item => ({

                category: item._id,

                amount:
                    Number(
                        item.amount.toFixed(2)
                    )
            }));


        // ==========================================
        // TOP EXPENSES
        // ==========================================

        const topExpenses =
            await Expense.find({

                userId: userObjectId,

                date: {
                    $gte: startDate,
                    $lt: endDate
                }

            })
                .sort({
                    amount: -1
                })
                .limit(5)
                .select(
                    "amount description category subCategory paymentMethod date"
                )
                .lean();


        // ==========================================
        // DAILY SPENDING TREND
        // ==========================================

        const dailyTrend =
            await Expense.aggregate([

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

                        _id: {
                            day: {
                                $dayOfMonth: "$date"
                            }
                        },

                        amount: {
                            $sum: "$amount"
                        }
                    }
                },

                {
                    $sort: {
                        "_id.day": 1
                    }
                }
            ]);


        const spendingTrend =
            dailyTrend.map(item => ({

                day: item._id.day,

                amount:
                    Number(
                        item.amount.toFixed(2)
                    )
            }));


        // ==========================================
        // BUDGET STATUS
        // ==========================================

        const budgets =
            await Budget.find({

                userId: userObjectId,

                month,

                year

            }).lean();


        const budgetStatus = [];


        for (const budget of budgets) {

            let match = {

                userId: userObjectId,

                date: {
                    $gte: startDate,
                    $lt: endDate
                }
            };


            if (
                budget.category &&
                budget.category !== "Overall"
            ) {

                match.category =
                    budget.category;
            }


            const spending =
                await Expense.aggregate([

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


            const spent =
                spending[0]?.spent || 0;


            const percentageUsed =
                budget.amount > 0
                    ? (
                        spent /
                        budget.amount
                    ) * 100
                    : 0;


            let status;


            if (percentageUsed > 100) {

                status = "EXCEEDED";

            } else if (percentageUsed >= 80) {

                status = "WARNING";

            } else if (percentageUsed >= 70) {

                status = "WATCH";

            } else {

                status = "NORMAL";
            }


            budgetStatus.push({

                category:
                    budget.category,

                budget:
                    Number(
                        budget.amount.toFixed(2)
                    ),

                spent:
                    Number(
                        spent.toFixed(2)
                    ),

                remaining:
                    Number(
                        (
                            budget.amount -
                            spent
                        ).toFixed(2)
                    ),

                percentageUsed:
                    Number(
                        percentageUsed.toFixed(2)
                    ),

                status
            });
        }


        // ==========================================
        // UNUSUAL SPENDING
        // ==========================================

        const unusualSpending =
            await getUnusualSpending(
                userObjectId,
                month,
                year
            );


        // ==========================================
        // FINAL RESPONSE
        // ==========================================

        return {

            period: {
                month,
                year
            },

            summary: {

                totalIncome:
                    Number(
                        totalIncome.toFixed(2)
                    ),

                totalExpense:
                    Number(
                        totalExpense.toFixed(2)
                    ),

                savings:
                    Number(
                        savings.toFixed(2)
                    ),

                savingsRate:
                    Number(
                        savingsRate.toFixed(2)
                    )
            },

            categoryBreakdown,

            spendingTrend,

            topExpenses,

            budgetStatus,

            unusualSpending
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    getMonthlyReports
}