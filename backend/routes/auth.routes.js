const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middlewares")


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

    app.post('/aft/api/v1/user',
        authMiddleware.isAuthenticated,
        authController.getUserByEmail
    )

    app.post('/aft/api/v1/user/:id',
        authMiddleware.isAuthenticated,
        authController.updateUser
    )
}


module.exports = routes;