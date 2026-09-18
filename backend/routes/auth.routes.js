const authController = require("../controllers/auth.controller")


const routes = (app) =>{
    app.post('/aft/api/v1/auth/signup',
        authController.userRegister
    )
}


module.exports = routes;