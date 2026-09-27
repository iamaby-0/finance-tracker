const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const env = require("../config/env")

const userResistration = async (data) => {
    try {

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw {
                error: "User already Exist", code: 404
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

const findUserByEmail = async (email) => {
    try {
        const response = await User.findOne({ email }); 

        if (!response){
            throw{error: "No user found on given email", code: 404}
        }

        return response;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

const findUserById = async (UserId) => {
    try {
        const response = await User.findById(UserId);
        if (!response) {
            throw {
                error: "No user found on given Id",
                code: 404
            }
        }

        return response;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

const loginUser = async (data) => {
    const {email, password} = data;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw { error: "Invalid user or Password", code: 404 }
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        )

        if (!isPasswordValid) {
            throw { error: "Invalid user or Password", code: 404 }
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email
        },
            env.jwtSecret,
            {
                expiresIn: "7d"
            }
        );

        return {
            user,
            token
        };
    }
    catch (error) {
        console.log(error);
        throw error
    }
}

const update = async(userId, data) =>{
    try{
        const response = await User.findByIdAndUpdate(
            userId,
            {
                $set : data
            },
            {
                new : true,
                runValidators : true
            }
        )

        if(!response){
            throw {error : "invalid id ,user not found", code : 404}
        }

        return response;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}



module.exports = {
    userResistration,
    findUserById,
    loginUser,
    findUserByEmail,
    update

}