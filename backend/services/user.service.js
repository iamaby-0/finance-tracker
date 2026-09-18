const User = require("../models/user.model")
const bcrypt = require("bcrypt")

const userResistration = async (data) => {
    try {

        const existingUser = await User.findOne({email});

        if(existingUser){
            throw {
                error : "User already Exist", code : 404
            }
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        console.log(hashedPassword)

        data.password = hashedPassword;
        const response = await User.create(data);

        return response;
    }
    catch (error) {
        console.log(error);
        if (error == "ValidationError") {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            })
            throw {
                error: err, code: 400
            }
        }
        throw error;
    }
}

const signin = async(data)=>{

}

const findUserById = async(UserId) =>{
    try{
        const response = await User.findById(UserId);
        if(!response){
            throw {
                error :"No user found on given Id",
                code : 404
            }
        }

        return response;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

module.exports = {
    userResistration
}