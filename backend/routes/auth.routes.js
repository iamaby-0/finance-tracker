const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middlewares")
const passport = require('passport');


const routes = (app) =>{
    app.post('/aft/api/v1/auth/signup',
        authMiddleware.userCreateRequest,
        authController.signup
    )

    app.post("/aft/api/v1/auth/signin",
        authMiddleware.validateSigninRequest,
        authController.signin
    )

    app.get("/aft/api/v1/user/:id",
        authMiddleware.isAuthenticated,
        authController.getUserById
    )

    app.post('/aft/api/v1/user/email',
        authMiddleware.isAuthenticated,
        authController.getUserByEmail
    )

    app.post('/aft/api/v1/user/update/:id',
        authMiddleware.isAuthenticated,
        authController.updateUser
    )

    //google auth routes
    app.get('/aft/api/v1/auth/google',
        passport.authenticate(
            'google',
            {
                scope : ['profile', 'email'],
                session : false
            }
        )
    );

    app.get('/aft/api/v1/auth/google/callback',
        passport.authenticate(
            'google',
            {
                failureRedirect : `${process.env.FRONTEND_URL || 'http://localhost:5173'}/signin`,
                session : false
            }
        ),
        authController.googleAuthCallback
    );
}


module.exports = routes;