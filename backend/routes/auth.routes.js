const authController = require("../controllers/auth.controller")


const routes = (app) =>{
    app.post('/aft/api/v1/auth/signup',
        authController.userRegister
    )

    app.post("/aft/api/v1/auth/signin",
        authController.signin
    )
}


module.exports = routes;