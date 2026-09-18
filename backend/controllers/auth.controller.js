const userService = require("../services/user.service")

const userRegister = async(req, res)=>{
    try{
        const response = await userService.userResistration(req.body);

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

module.exports = {
    userRegister
}