const authService = require("../services/auth.service")
const { errorResponseBody, successResponseBody } = require("../utils/responseBody")
const jwt = require("jsonwebtoken")


const normalizeErrorPayload = (error) => {
    if (typeof error === "string") return error;

    if (Array.isArray(error)) return error.join(", ");

    if (error && typeof error === "object") {
        const values = Object.values(error);
        if (values.length) return values.join(", ");
        return "Registration failed";
    }

    return "Registration failed";
};

const signup = async (req, res) => {
    try {
        const response = await authService.userResistration(req.body);

        if (response.error) {
            return res.status(response.code).json({
                success: false,
                error: normalizeErrorPayload(response.error),
                message: response.message || normalizeErrorPayload(response.error),
                data: {}
            })
        }

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: response
        })
    }
    catch (error) {
        const status = error?.code || 500;
        const payloadError = normalizeErrorPayload(error?.error || error?.message || "Registration failed");

        return res.status(status).json({
            success: false,
            error: payloadError,
            message: error?.message || payloadError,
            data: {}
        })
    }
}

const signin = async (req, res) => {
    try {
        const response = await authService.loginUser(req.body)
        return res.status(200).json({
            success: true,
            messsage: "Login Successful",
            token: response.token,
            data: response.user
        })

    }
    catch (error) {
        errorResponseBody.error = error;

        return res.status(500).json(errorResponseBody)
    }
}

const getUserById = async (req, res) => {
    try {
        const response = await authService.findUserById(req.user.id)

        if (response.error) {
            errorResponseBody.error = response.error;
            return res.status(response.code).json(errorResponseBody)
        }

        successResponseBody.data = response;
        successResponseBody.message = "User fetched successfully by id"
        return res.status(200).json(successResponseBody)
    }
    catch (error) {
        errorResponseBody.error = error;

        return res.status(500).json(errorResponseBody)
    }
}

const getUserByEmail = async (req, res) => {
    try {
        const response = await authService.findUserByEmail(req.body.email)

        if (response.error) {
            errorResponseBody.error = response.error;
            return res.status(response.code).json(errorResponseBody)
        }
        successResponseBody.data = response;
        successResponseBody.message = "User fetched successfully by email"
        return res.status(200).json(successResponseBody)
    }
    catch (error) {
        errorResponseBody.error = error;

        return res.status(500).json(errorResponseBody)
    }
}

const updateUser = async (req, res) => {
    try {
        const response = await authService.update(req.params.id, req.body)

    }
    catch (error) {
        errorResponseBody.error = error;

        return res.status(500).json(errorResponseBody)
    }
}

const env = require("../config/env");

const googleAuthCallback = async (req, res) => {
    try {
        const user = req.user;
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

        if (!user) {
            return res.redirect(
                `${frontendUrl}/signin?error=UserNotFound`
            );
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            env.jwtSecret,
            { expiresIn: '7d' }
        );

        const redirectUrl = new URL(`${frontendUrl}/google-success`);
        redirectUrl.searchParams.set("token", token);
        redirectUrl.searchParams.set("email", user.email);

        return res.redirect(redirectUrl.toString());
    }
    catch (error) {
        console.error("Google auth callback error:", error);
        errorResponseBody.error = error;
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        return res.redirect(`${frontendUrl}/signin?error=${encodeURIComponent(error.message)}`);
    }
}

module.exports = {
    signup,
    getUserById,
    signin,
    getUserByEmail,
    updateUser,
    googleAuthCallback
}