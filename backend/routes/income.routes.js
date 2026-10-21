const incomeController = require("../controllers/income.controller")
const incomeMiddleware = require('../middlewares/income.middleware')
const authMiddleware = require('../middlewares/auth.middlewares')

const routes = (app) =>{
    app.post('/aft/api/v1/income',
        authMiddleware.isAuthenticated,
        incomeMiddleware.incomeCreateRequest,
        incomeController.createIncome

    )

    app.get('/aft/api/v1/income/:id',
        authMiddleware.isAuthenticated,
        incomeController.getIncomeById
    )

    app.get(['/aft/api/v1/income', '/aft/api/v1/income/'],
        authMiddleware.isAuthenticated,
        incomeController.getAllincome
    )

    app.patch('/aft/api/v1/income/:id',
        authMiddleware.isAuthenticated,
        incomeController.updateIncome
    )

    app.delete('/aft/api/v1/income/:id',
        authMiddleware.isAuthenticated,
        incomeController.deleteIncome
    )


}

module.exports = routes