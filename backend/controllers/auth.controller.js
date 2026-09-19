const authService = require("../services/auth.service")
const {errorResponseBody, successResponseBody} = require("../utils/responseBody")

const userRegister = async(req, res)=>{
    try{
        const response = await authService.userResistration(req.body);

        if(response.error){
            return res.status(response.code).json({
                success : false,
                error : response.error,
                message : "something went wrong",
                data : {}
            })
        }

        res.status(201).json({
            success : true,
            message : "User created successfully",
            data : response
        })
    }
    catch(error){
        return res.status(500).json({
            success : false ,
            error : erorr,
            message : "User Not Registered || Invalid Server Error"

        })
    }
}

const signin = async(req, res)=>{
    try{
        const response = await authService.loginUser(req.body)
        return res.status(200).json({
            success : true,
            messsage : "Login Successful",
            token : response.token,
            data : response.user
        })

    }
    catch(error){
        errorResponseBody.error = error;

        return res.status(500).json(errorResponseBody)
    }
}

module.exports = {
    userRegister,
    signin
}