const {errorResponseBody} = require('../utils/responseBody')

const incomeCreateRequest = async (req, res, next) => {
    if (!req.user || !req.user.id) {
        errorResponseBody.error = "userId required";
        return res.status(400).json(errorResponseBody);
    }

    if (!req.body.amount || Number(req.body.amount) <= 0) {
        errorResponseBody.error = "A valid positive amount is required";
        return res.status(400).json(errorResponseBody);
    }

    if (!req.body.source) {
        errorResponseBody.error = "Source is required";
        return res.status(400).json(errorResponseBody);
    }

    next();
}

module.exports = {
    incomeCreateRequest
}