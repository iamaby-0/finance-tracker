const incomeController = require("../controllers/income.controller")
const authMiddleware = require('../middlewares/auth.middlewares')

const routes = (app) =>{
    app.post('/aft/api/v1/income',
        authMiddleware.isAuthenticated,
        incomeController.createIncome

    )
}

module.exports = routes