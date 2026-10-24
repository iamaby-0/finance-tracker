const Groq = require("groq-sdk");
const config = require("../../config/env.js");

const groq = new Groq({
    apiKey: config.groqApiKey
});

const generateAIResponse = async (messages, options = {}) => {
    try {
        const response = await groq.chat.completions.create({
            model: options.model || "openai/gpt-oss-120b",
            messages: messages,
            temperature: options.temperature ?? 0.2,
            max_completion_tokens: options.max_completion_tokens ?? 1500
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.log("========== GROQ ERROR ==========");
        console.log("Message:", error.message);
        console.log("Status:", error.status);
        console.log("Code:", error.code);
        console.log("================================");

        // Fallback to llama-3.3-70b-versatile if gpt-oss-120b has issues
        try {
            const fallback = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: messages,
                temperature: options.temperature ?? 0.2,
                max_completion_tokens: options.max_completion_tokens ?? 1500
            });
            return fallback.choices[0].message.content;
        } catch (fallbackErr) {
            console.log("Fallback also failed:", fallbackErr.message);
            throw new Error("AI service temporarily unavailable");
        }
    }
};

module.exports = {
    generateAIResponse
};