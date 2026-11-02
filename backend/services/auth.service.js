const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

const userResistration = async (data) => {
    try {
        const normalizedEmail = data.email?.toLowerCase().trim();
        data.email = normalizedEmail;

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return {
                error: "User already Exist", code: 409
            };
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        const response = await User.create(data);

        const userObj = response.toObject();
        delete userObj.password;
        return userObj;
    }
    catch (error) {
        console.error("userRegistration error:", error);
        if (error.name == "ValidationError") {
            const err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            throw {
                error: err,
                message: "Validation failed",
                code: 400
            };
        }

        if (error && error.code === 11000) {
            throw {
                error: "User already exists with this email",
                message: "User already exists with this email",
                code: 409
            };
        }

        throw error;
    }
};

const findUserByEmail = async (email) => {
    try {
        if (!email) {
            throw { error: "Email is required", code: 400 };
        }

        const normalizedEmail = email.toLowerCase().trim();
        const response = await User.findOne({ email: normalizedEmail }).select("-password");

        if (!response) {
            throw { error: "No user found on given email", code: 404 };
        }

        return response;
    }
    catch (error) {
        console.error("findUserByEmail error:", error);
        throw error;
    }
};

const findUserById = async (UserId) => {
    try {
        const response = await User.findById(UserId).select("-password");
        if (!response) {
            throw {
                error: "No user found on given Id",
                code: 404
            };
        }

        return response;
    }
    catch (error) {
        console.error("findUserById error:", error);
        throw error;
    }
};

const loginUser = async (data) => {
    const { email, password } = data;
    try {
        if (!email || !password) {
            throw { error: "Email and password are required", code: 400 };
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            throw { error: "Invalid user or Password", code: 404 };
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            throw { error: "Invalid user or Password", code: 404 };
        }

        const token = jwt.sign({
            id: user.id || user._id,
            email: user.email
        },
            env.jwtSecret,
            {
                expiresIn: "7d"
            }
        );

        const userObj = user.toObject();
        delete userObj.password;

        return {
            user: userObj,
            token
        };
    }
    catch (error) {
        console.error("loginUser error:", error);
        throw error;
    }
};

const update = async (userId, data) => {
    try {
        if (data.password) {
            delete data.password;
        }

        const response = await User.findByIdAndUpdate(
            userId,
            {
                $set: data
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!response) {
            throw { error: "invalid id ,user not found", code: 404 };
        }

        return response;
    }
    catch (error) {
        console.error("update user error:", error);
        throw error;
    }
};

module.exports = {
    userResistration,
    findUserById,
    loginUser,
    findUserByEmail,
    update
};
