const { errorResponseBody } = require('../utils/responseBody')

const monthalySummaryRequest = async (req, res, next) => {
    if (!req.body.month || req.body.month < 1 || req.body.month > 12) {
        errorResponseBody.error = "Month required or Invalid Month"
        return res.status(400).json(errorResponseBody)
    }

    if (!req.body.year) {
        errorResponseBody.error = "Year required"
        return res.status(400).json(errorResponseBody)
    }
    next();
}

module.exports = {
    monthalySummaryRequest
}