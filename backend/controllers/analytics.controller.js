const analyticsService = require('../services/analytics.service')
const {successResponseBody, errorResponseBody} = require('../utils/responseBody')

const getMonthlySummary = async(req, res) =>{
    try{
        const summary = await analyticsService.getMonthlySummary(
            req.user.id,
            req.body.month,
            req.body.year
        )

        successResponseBody.data = summary;
        successResponseBody.message = "Monthaly Summary"

        return res.status(200).json(successResponseBody)
    }
    catch(error){
        errorResponseBody.error = error
        return res.status(500).json(errorResponseBody)
    }
}

module.exports = {
    getMonthlySummary
}