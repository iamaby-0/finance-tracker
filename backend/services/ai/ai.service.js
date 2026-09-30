const { generateQwenResponse } = require("./groq.service")

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

    const response = await generateQwenResponse(
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
};

module.exports = {
    categorizeExpense
};