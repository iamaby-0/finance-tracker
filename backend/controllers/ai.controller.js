const aiService = require("../services/ai/ai.service");
const { successResponseBody, errorResponseBody } = require("../utils/responseBody");

const FinancialInsights = async(req, res) =>{
    try {
        const userId = req.user.id;

        const reponse = await aiService.generateFinancialInsights(userId);

        successResponseBody.data = reponse;
        successResponseBody.message = 'Financial insights generated successfully'

        return res.status(200).json(successResponseBody);
    }
    catch(error){
        console.log("contro : ", error)
        errorResponseBody.error = error;

        return res.status(500).json(errorResponseBody)
    }
}

module.exports = {
    FinancialInsights
}