const {errorResponseBody} = require("../utils/responseBody")

const expenseCreateMiddleware = async(req, res,next)=>{
    if (!req.user || !req.user.id) {
        errorResponseBody.error = "userId required";
        return res.status(400).json(errorResponseBody);
    }

    if (req.body.amount === undefined || req.body.amount === null || req.body.amount === "") {
        errorResponseBody.error = "amount required";
        return res.status(400).json(errorResponseBody);
    }

    if (typeof req.body.amount !== "number" || req.body.amount < 0) {
        errorResponseBody.error = "amount must be a non-negative number";
        return res.status(400).json(errorResponseBody);
    }

    if (!req.body.description || req.body.description.trim() === "") {
        errorResponseBody.error = "description required";
        return res.status(400).json(errorResponseBody);
    }

    next();
}

module.exports = {
    expenseCreateRequest
};