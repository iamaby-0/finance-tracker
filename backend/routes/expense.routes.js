const expenseController = require('../controllers/expense.controller')
const authMiddleware = require('../middlewares/auth.middlewares')

const routes = (app) =>{
    app.post('/aft/api/v1/expenses',
       authMiddleware.isAuthenticated,
        expenseController.createExp
    )

    app.get('/aft/api/v1/expenses',
        expenseController.getAllExpernses
    )
}

module.exports = routes;