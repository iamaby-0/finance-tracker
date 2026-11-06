const authService = require("../services/auth.service");
const { errorResponseBody, successResponseBody } = require("../utils/responseBody");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

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
            return res.status(response.code || 400).json({
                success: false,
                error: normalizeErrorPayload(response.error),
                message: response.message || normalizeErrorPayload(response.error),
                data: {}
            });
        }

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: response
        });
    }
    catch (error) {
        const status = error?.code || 500;
        const payloadError = normalizeErrorPayload(error?.error || error?.message || "Registration failed");

        return res.status(status).json({
            success: false,
            error: payloadError,
            message: error?.message || payloadError,
            data: {}
        });
    }
};

const signin = async (req, res) => {
    try {
        const response = await authService.loginUser(req.body);
        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token: response.token,
            data: response.user
        });
    }
    catch (error) {
        console.error("Signin error:", error);
        return res.status(error.code || 500).json({
            success: false,
            error: error.message || error.error || "Login failed",
            message: error.message || "Invalid email or password",
            data: {}
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const response = await authService.findUserById(req.user.id);

        if (response.error) {
            return res.status(response.code || 404).json({
                success: false,
                message: response.error,
                error: response.error,
                data: {}
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully by id",
            data: response
        });
    }
    catch (error) {
        console.error("getUserById error:", error);
        return res.status(error.code || 500).json({
            success: false,
            message: error.message || error.error || "Failed to fetch user by id",
            error: error.message || error.error || error,
            data: {}
        });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const email = req.body?.email;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
                error: "Email is required",
                data: {}
            });
        }

        const response = await authService.findUserByEmail(email);

        if (response.error) {
            return res.status(response.code || 404).json({
                success: false,
                message: response.error,
                error: response.error,
                data: {}
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully by email",
            data: response
        });
    }
    catch (error) {
        console.error("getUserByEmail error:", error);
        return res.status(error.code || 500).json({
            success: false,
            message: error.message || error.error || "Failed to fetch user by email",
            error: error.message || error.error || error,
            data: {}
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const response = await authService.update(req.params.id, req.body);
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: response
        });
    }
    catch (error) {
        console.error("updateUser error:", error);
        return res.status(error.code || 500).json({
            success: false,
            message: error.message || error.error || "Failed to update user",
            error: error.message || error.error || error,
            data: {}
        });
    }
};

const googleAuthCallback = async (req, res) => {
    let clientUrl = req.query.state || env.frontendUrl || process.env.FRONTEND_URL || "https://my-finance-tracker-omega-ten-32.vercel.app";
    try {
        clientUrl = new URL(clientUrl).origin;
    } catch {
        clientUrl = env.frontendUrl || "https://my-finance-tracker-omega-ten-32.vercel.app";
    }

    try {
        const user = req.user;

        if (!user) {
            console.error("Google auth callback: No user found on req");
            return res.redirect(`${clientUrl}/signin?error=UserNotFound`);
        }

        const token = jwt.sign(
            { id: user._id || user.id, email: user.email },
            env.jwtSecret,
            { expiresIn: '7d' }
        );

        const safeUser = {
            _id: user._id || user.id,
            id: user._id || user.id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture || "",
            occupation: user.occupation || "student",
            currency: user.currency || "INR",
            authProvider: user.authProvider || "google",
            theme: user.theme || "dark",
            notifications: user.notifications
        };

        const redirectUrl = new URL(`${clientUrl}/google-success`);
        redirectUrl.searchParams.set("token", token);
        redirectUrl.searchParams.set("email", user.email);
        redirectUrl.searchParams.set("user", Buffer.from(JSON.stringify(safeUser)).toString("base64"));

        return res.redirect(redirectUrl.toString());
    }
    catch (error) {
        console.error("Google auth callback error:", error);
        return res.redirect(`${clientUrl}/signin?error=${encodeURIComponent(error.message || "GoogleAuthFailed")}`);
    }
};

module.exports = {
    signup,
    getUserById,
    signin,
    getUserByEmail,
    updateUser,
    googleAuthCallback
};
