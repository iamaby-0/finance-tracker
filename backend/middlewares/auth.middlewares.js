const {errorResponseBody} = require("../utils/responseBody")
const jwt = require("jsonwebtoken")
const env = require("../config/env")

const userCreateRequest = async(req, res,next)=>{
    if(!req.body.name){
        errorResponseBody.error = "Name required"

        return res.status(400).json(errorResponseBody)
    }

    if(!req.body.email){
        errorResponseBody.error = "email required"

        return res.status(400).json(errorResponseBody)
    }

    if(!req.body.password){
        errorResponseBody.error = "provide Password"

        return res.status(400).json(errorResponseBody)
    }
    next();
}

const validateSigninRequest = async(req, res, next)=>{
    if(!req.body.email){
        errorResponseBody.error = "email required"

        return res.status(400).json(errorResponseBody)
    }

    if(!req.body.password){
        errorResponseBody.error = "provide Password"

        return res.status(400).json(errorResponseBody)
    }
    next();
}

const isAuthenticated = async(req, res, next)=>{
    try{

        const authHeader = req.headers.authorization;
        const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
        const token = req.headers["x-access-token"] || bearerToken;

        if(!token){
            errorResponseBody.error = "No token provided"
            return res.status(401).json(errorResponseBody)
        }

        const response = jwt.verify(token, env.jwtSecret)

        if(!response){
            errorResponseBody.error = "Invalid token || token not verified";
            return res.status(401).json(errorResponseBody)
        }

        req.user = {
            id : response.id || response.userId
        }

        next()

    }
    catch(error){

        if(error.name == "TokenExpiredError"){
            errorResponseBody.error = "Token Expired"
            return res.status(401).json(errorResponseBody)
        }

        if(error.name == "JsonWebTokenError"){
            errorResponseBody.error = "Invalid Token"
            return res.status(401).json(errorResponseBody)
        }   

        errorResponseBody.error = "Athentication Failed || Invalid Server Error"

        return res.status(401).json(errorResponseBody)

    }
}

module.exports = {
    userCreateRequest,
    validateSigninRequest,
    isAuthenticated

}