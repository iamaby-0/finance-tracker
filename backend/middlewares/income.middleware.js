const {errorResponseBody} = require('../utils/responseBody')

const incomeCreateRequest = async(req, res)=>{
    if(!req.user.id){
        errorResponseBody.error = "userId required"

        return res.status(400).json(errorResponseBody)
    }

    if(!req.body.amount){
        errorResponseBody.error = "amount required"

        return res.status(400).json(errorResponseBody)
    }

    if(!req.body.source){
        errorResponseBody.error = "source required"

        return res.status(400).json(errorResponseBody)
    }

    
}

module.exports = {
    incomeCreateRequest
}