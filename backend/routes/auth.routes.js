const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middlewares");
const passport = require('../config/passport');
const env = require("../config/env");

const routes = (app) => {
    app.post('/aft/api/v1/auth/signup',
        authMiddleware.userCreateRequest,
        authController.signup
    );

    app.post("/aft/api/v1/auth/signin",
        authMiddleware.validateSigninRequest,
        authController.signin
    );

    app.get("/aft/api/v1/user/:id",
        authMiddleware.isAuthenticated,
        authController.getUserById
    );

    app.post('/aft/api/v1/user/email',
        authMiddleware.isAuthenticated,
        authController.getUserByEmail
    );

    app.post('/aft/api/v1/user/update/:id',
        authMiddleware.isAuthenticated,
        authController.updateUser
    );

    // Google OAuth routes
    app.get('/aft/api/v1/auth/google', (req, res, next) => {
        const state = req.query.state || env.frontendUrl || "https://my-finance-tracker-omega-ten-32.vercel.app";
        passport.authenticate(
            'google',
            {
                scope: ['profile', 'email'],
                session: false,
                state: state
            }
        )(req, res, next);
    });

    app.get('/aft/api/v1/auth/google/callback', (req, res, next) => {
        const fallbackUrl = env.frontendUrl || "https://my-finance-tracker-omega-ten-32.vercel.app";
        const clientUrl = req.query.state || fallbackUrl;
        passport.authenticate(
            'google',
            {
                failureRedirect: `${clientUrl}/signin?error=GoogleAuthFailed`,
                session: false
            }
        )(req, res, next);
    },
    authController.googleAuthCallback
    );
};

module.exports = routes;
