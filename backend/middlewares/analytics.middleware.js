const { errorResponseBody } = require('../utils/responseBody')

const monthalySummaryRequest = async (req, res, next) => {
    const month = req.body?.month || req.query?.month;
    const year = req.body?.year || req.query?.year;

    if (!month || Number(month) < 1 || Number(month) > 12) {
        errorResponseBody.error = "Month required or Invalid Month"
        return res.status(400).json(errorResponseBody)
    }

    if (!year) {
        errorResponseBody.error = "Year required"
        return res.status(400).json(errorResponseBody)
    }

    req.body = req.body || {};
    req.body.month = Number(month);
    req.body.year = Number(year);
    req.query.month = Number(month);
    req.query.year = Number(year);
    next();
}

module.exports = {
    monthalySummaryRequest
}