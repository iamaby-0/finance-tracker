const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middlewares")


const routes = (app) =>{
    app.post('/aft/api/v1/auth/signup',
        authMiddleware.userCreateRequest,
        authController.userRegister
    )

    app.post("/aft/api/v1/auth/signin",
        authMiddleware.validateSigninRequest,
        authController.signin
    )
}


module.exports = routes;