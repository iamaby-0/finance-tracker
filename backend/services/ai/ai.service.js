const mongoose = require("mongoose")
const { generateAIResponse } = require("./groq.service")
const Expense = require('../../models/expense.model')
const Income = require('../../models/income.model')
const Budget = require('../../models/budget.model')
const ObjectId = new mongoose.Types.ObjectId;


const allowedCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Health",
    "Education",
    "Travel",
    "Rent",
    "Investment",
    "Other"
];

const categorizeExpense = async (description, amount) => {

    const messages = [
        {
            role: "system",
            content: `
You are an AI assistant for a personal finance application.

Your job is to categorize expenses.

Allowed categories:
Food
Transport
Shopping
Entertainment
Bills
Health
Education
Travel
Rent
Investment
Other

Always return ONLY valid JSON.

Required format:
{
    "category": "Food",
    "subCategory": "Restaurant",
    "confidence": 0.95
}

Rules:
1. category MUST be one of the allowed categories.
2. confidence MUST be between 0 and 1.
3. subCategory should be short and relevant.
4. Do not include explanations.
5. Do not use markdown.
`
        },
        {
            role: "user",
            content: `
                Expense description: ${description}
                Expense amount: ${amount}
                `
        }
    ];

    const response = await generateAIResponse(
        messages,
        {
            temperature: 0.2,
            max_completion_tokens: 300
        }
    );

    let result;

    try {
        result = JSON.parse(response);
    } catch (error) {
        console.error("Invalid JSON from Qwen:", response);

        throw new Error("AI returned invalid JSON");
    }

    if (!allowedCategories.includes(result.category)) {
        throw new Error("AI returned an invalid category");
    }

    if (
        typeof result.confidence !== "number" ||
        result.confidence < 0 ||
        result.confidence > 1
    ) {
        throw new Error("AI returned invalid confidence");
    }

    return {
        category: result.category,
        subCategory: result.subCategory || "Other",
        confidence: result.confidence
    };
}

const generateFinancialInsights = async (userId) => {
    try {
        const userObjId = ObjectId(userId);

        // for ^ Months
        const endDate = new Date();
        const startDate = new Date();

        startDate.setMonth(startDate.getMonth() - 6);

        // for Income of 6months

        const incomeResult = await Income.aggregate([
            {
                $match: {
                    userId: userObjId,

                    date: {
                        $gte: startDate,
                        $lte: endDate
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

        const totalIncome = incomeResult[0].totalIncome || 0;

        //for Expense

        const expenseResult = await Expense.aggregate([
            {
                $match: {
                    userId: userObjId,

                    date: {
                        $gte: startDate,
                        $lte: endDate
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

        totalExpense = expenseResult[0].totalExpense || 0;

        //category Spending

        const categoryResult = await Expense.aggregate([
            {
                $match: {
                    userId: userObjId,

                    date: {
                        $gte: startDate,
                        $lte: endDate
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

        const categorySpending = categoryResult.map(item => ({
            category: item._id,
            amount: Number(item.amount.toFixed(2))
        }));

        //saving 

        const savings = totalIncome - totalExpense;

        const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

        // curent month

        const now = new Date();

        const currentMonth = now.getMonth() + 1;

        const currentYear = now.getFullYear();

        const monthStart = new Date(currentYear, currentMonth - 1, 1);

        const monthEnd = new Date(currentYear, currentMonth, 1);

        // curremt month Expense


        const currentMonthExpense =
            await Expense.aggregate([

                {
                    $match: {

                        userId: userObjectId,

                        date: {
                            $gte: monthStart,
                            $lt: monthEnd
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


        const currentMonthCategories =
            currentMonthExpense.map(item => ({

                category: item._id,

                amount: Number(
                    item.amount.toFixed(2)
                )
            }));


        // budget Status


        const budgets = await Budget.find({
            userId: userObjectId,

            month: currentMonth,

            year: currentYear
        }).lean();

        const budgetStatus = [];

        for (const budget of budgets) {
            let match = {

                userId: userObjectId,

                date: {
                    $gte: monthStart,
                    $lt: monthEnd
                }
            };


            if (budget.category && budget.category !== "Overall") {
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


            const percentageUsed = budget.amount > 0 ? (spent / budget.amount) * 100: 0;


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
                    budget.amount,

                spent,

                percentageUsed:
                    Number(
                        percentageUsed.toFixed(2)
                    ),

                status
            });
        }


         // PREPARE DATA FOR AI
        // ==========================================

        const financialData = {

            period: "Last 6 months",

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
                ),

            topCategories:
                categorySpending.slice(0, 5),

            currentMonthCategories,

            budgetStatus
        };


        // ==========================================
        // AI PROMPT
        // ==========================================

        const messages = [

            {
                role: "system",

                content: `
You are an AI personal finance analysis assistant.

Analyze the user's financial data and provide
practical, conservative and easy-to-understand
financial insights.

Do NOT invent data.

Do NOT provide investment, tax or legal advice.

Only use the information provided.

Return ONLY valid JSON.

The JSON must have exactly this structure:

{
    "summary": "short overall financial summary",

    "insights": [
        "insight 1",
        "insight 2",
        "insight 3"
    ],

    "recommendations": [
        "recommendation 1",
        "recommendation 2",
        "recommendation 3"
    ]
}

Keep each insight and recommendation concise.
`
            },

            {
                role: "user",

                content:
                    JSON.stringify(
                        financialData
                    )
            }

        ];


        // ==========================================
        // CALL GPT-OSS
        // ==========================================

        const aiResponse =
            await generateAIResponse(
                messages,
                {
                    temperature: 0.2,

                    max_completion_tokens: 800,

                    reasoning_effort: "default"
                }
            );


        // ==========================================
        // PARSE AI RESPONSE
        // ==========================================

        let insights;


        try {

            insights =
                JSON.parse(aiResponse);

        } catch (error) {

            console.error(
                "AI JSON parsing error:",
                aiResponse
            );

            throw new Error(
                "AI returned invalid JSON"
            );
        }


        return {

            financialData,

            aiInsights: insights

        };

    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    categorizeExpense,
     generateAIResponse
};