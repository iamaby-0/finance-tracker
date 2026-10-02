const expenseController = require('../controllers/expense.controller')
const authMiddleware = require('../middlewares/auth.middlewares')
const expenseMiddleware = require('../middlewares/expense.middleware')

const routes = (app) =>{
    app.post('/aft/api/v1/expenses',
       authMiddleware.isAuthenticated,
       expenseMiddleware.expenseCreateRequest,
        expenseController.createExp
    )

    app.get('/aft/api/v1/expenses',
        authMiddleware.isAuthenticated,
        expenseController.getAllExpernses
    )

    app.get('/aft/api/v1/expenses/:id',
        authMiddleware.isAuthenticated,
        expenseController.getExpenseByid
    )

    app.patch('/aft/api/v1/expenses/:id',
        authMiddleware.isAuthenticated,
        expenseController.updateExpense
    )

    app.delete('/aft/api/v1/expenses/:id',
        authMiddleware.isAuthenticated,
        expenseController.updateExpense
    )
}

module.exports = routes;