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

const getCatogarySpend = async(req, res)=>{
    try{

        const response = await analyticsService.getCategorySpending(
            req.user.id,
            req.query.month,
            req.query.year
        )

        successResponseBody.data = response;
        successResponseBody.message = "Successfully catogoriesed by month & year"
        return res.status(200).json(successResponseBody)

    }
    catch(error){
        errorResponseBody.error = error;
        return res.status(500).json(errorResponseBody)
    }
}

const getMonthlyTrend = async(req, res)=>{
    try{

        const response = await analyticsService.getMonthlytrend(
            req.user.id,
            req.query.year
        )

        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetch Trends "

        return res.status(200).json(successResponseBody)
    }
    catch(error){
        errorResponseBody.error = error;
        return res.status(500).json(errorResponseBody)
    }
}

const getBudgetStatus = async (req, res) => {

    try {

        const userId = req.user.id;

        const { id } = req.params;


        const status =
            await analyticsService.getBudgetStatus(
                userId,
                id
            );


        if (status.error) {
            errorResponseBody.error = status.error
            return res.status(status.code).json(errorResponseBody)
        }


         successResponseBody.data = response;
        successResponseBody.message = "Successfully fetch Trends "
        return res.status(200).json(successResponseBody)

    } catch (error) {
        errorResponseBody.error = error
        res.status(500).json(errorResponseBody);
    }
}

module.exports = {
    getMonthlySummary,
    getCatogarySpend,
    getMonthlyTrend,
    getBudgetStatus
}