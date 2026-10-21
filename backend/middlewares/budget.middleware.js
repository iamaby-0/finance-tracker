const {errorResponseBody} = require('../utils/responseBody')

const budgetCreateRequest = async (req, res, next) => {
    let { name, amount, month, year, startDate, endDate, category } = req.body;

    if (!req.user || !req.user.id) {
        errorResponseBody.error = "User authentication required";
        return res.status(401).json(errorResponseBody);
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
        errorResponseBody.error = "A valid positive budget amount is required";
        return res.status(400).json(errorResponseBody);
    }
    req.body.amount = numAmount;

    // Handle Dates, Month, and Year
    const now = new Date();
    let sDate = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
    if (isNaN(sDate.getTime())) {
        sDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    let eDate = endDate ? new Date(endDate) : new Date(sDate.getFullYear(), sDate.getMonth() + 1, 0, 23, 59, 59, 999);
    if (isNaN(eDate.getTime())) {
        eDate = new Date(sDate.getFullYear(), sDate.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    if (eDate < sDate) {
        errorResponseBody.error = "End date cannot be earlier than start date";
        return res.status(400).json(errorResponseBody);
    }

    const parsedMonth = Number(month) || (sDate.getMonth() + 1);
    const parsedYear = Number(year) || sDate.getFullYear();

    if (parsedMonth < 1 || parsedMonth > 12) {
        errorResponseBody.error = "Invalid month (must be between 1 and 12)";
        return res.status(400).json(errorResponseBody);
    }

    req.body.month = parsedMonth;
    req.body.year = parsedYear;
    req.body.startDate = sDate;
    req.body.endDate = eDate;
    req.body.category = category || 'Overall';
    req.body.name = (name && name.trim().length > 0) ? name.trim() : `${req.body.category} Budget`;

    next();
};

module.exports = {
    budgetCreateRequest
}