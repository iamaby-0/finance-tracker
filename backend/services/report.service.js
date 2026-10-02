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

const getYearlyReport = async (userId, year) => {

    try {

        const userObjectId =
            new mongoose.Types.ObjectId(userId);

        const startDate = new Date(
            year,
            0,
            1
        );

        const endDate = new Date(
            year + 1,
            0,
            1
        );


        // ==========================================
        // MONTHLY INCOME
        // ==========================================

        const incomeData =
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

                        _id: {
                            month: {
                                $month: "$date"
                            }
                        },

                        income: {
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


        // ==========================================
        // MONTHLY EXPENSE
        // ==========================================

        const expenseData =
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
                            month: {
                                $month: "$date"
                            }
                        },

                        expense: {
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


        // ==========================================
        // CATEGORY BREAKDOWN
        // ==========================================

        const categoryData =
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


        // ==========================================
        // BUILD 12 MONTHS
        // ==========================================

        const monthlyData = [];

        for (let month = 1; month <= 12; month++) {

            const income =
                incomeData.find(
                    item =>
                        item._id.month === month
                )?.income || 0;


            const expense =
                expenseData.find(
                    item =>
                        item._id.month === month
                )?.expense || 0;


            const savings =
                income - expense;


            const savingsRate =
                income > 0
                    ? (savings / income) * 100
                    : 0;


            monthlyData.push({

                month,

                income:
                    Number(
                        income.toFixed(2)
                    ),

                expense:
                    Number(
                        expense.toFixed(2)
                    ),

                savings:
                    Number(
                        savings.toFixed(2)
                    ),

                savingsRate:
                    Number(
                        savingsRate.toFixed(2)
                    )
            });
        }


        // ==========================================
        // YEAR TOTALS
        // ==========================================

        const totalIncome =
            monthlyData.reduce(
                (sum, item) =>
                    sum + item.income,
                0
            );


        const totalExpense =
            monthlyData.reduce(
                (sum, item) =>
                    sum + item.expense,
                0
            );


        const totalSavings =
            totalIncome - totalExpense;


        const savingsRate =
            totalIncome > 0
                ? (
                    totalSavings /
                    totalIncome
                ) * 100
                : 0;


        // ==========================================
        // CATEGORY BREAKDOWN
        // ==========================================

        const categoryBreakdown =
            categoryData.map(item => ({

                category:
                    item._id,

                amount:
                    Number(
                        item.amount.toFixed(2)
                    )
            }));


        // ==========================================
        // TOP CATEGORY
        // ==========================================

        const topCategory =
            categoryBreakdown.length > 0
                ? categoryBreakdown[0]
                : null;


        return {

            year,

            summary: {

                totalIncome:
                    Number(
                        totalIncome.toFixed(2)
                    ),

                totalExpense:
                    Number(
                        totalExpense.toFixed(2)
                    ),

                totalSavings:
                    Number(
                        totalSavings.toFixed(2)
                    ),

                savingsRate:
                    Number(
                        savingsRate.toFixed(2)
                    )
            },

            topCategory,

            categoryBreakdown,

            monthlyData

        };

    } catch (error) {

        console.error(
            "Yearly report error:",
            error
        );

        throw error;
    }
};
module.exports = {
    getMonthlyReports,
    getYearlyReport
}