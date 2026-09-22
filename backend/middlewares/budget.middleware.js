const {errorResponseBody} = require('../utils/responseBody')

const budgetCreateRequest = async(req, res, next)=>{

    const {name , amount , month, year} = req.body;

    if(!name || name.trim().length ===0){
        errorResponseBody.error = "Name required"
        return res.status(400).json(errorResponseBody)
    }

    if(!amount == underfined || typeof amount != "number" || amount <= 0){
        errorResponseBody.error = "amount Required "
        return res.status(400).json(errorResponseBody)
    }

    if(!Number.isInteger(month) || month < 1 || month >12){
        errorResponseBody.error = "Invalid Month"
        return res.status(400).json(errorResponseBody)
    }

    if(!Number.isInteger(year)){
        errorResponseBody.error = "Invalid year"
        return res.status(400).json(errorResponseBody)
    }
    next()
}

module.exports = {
    budgetCreateRequest
}