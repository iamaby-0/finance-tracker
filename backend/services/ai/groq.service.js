const Groq = require("groq-sdk");
const config = require("../../config/env.js");

const groq = new Groq({
    apiKey: config.groqApiKey
});

const generateAIResponse = async (messages, options = {}) => {

    try {

        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",

            messages: messages,

            temperature: options.temperature ?? 0.2,

            max_completion_tokens:
                options.max_completion_tokens ?? 300
        });

        return response.choices[0].message.content;

    } catch (error) {

        console.log("========== GROQ ERROR ==========");
        console.log("Message:", error.message);
        console.log("Status:", error.status);
        console.log("Code:", error.code);
        console.log(error);
        console.log("================================");

        throw new Error("Qwen Ai service Failed");
    }
};

module.exports = {
    generateAIResponse
};