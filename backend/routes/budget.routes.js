const budgetController = require('../controllers/budget.controller')
const authMiddleware = require('../middlewares/auth.middlewares')

const routes = (app) => {
   app.post('/aft/api/v1/budget',
      authMiddleware.isAuthenticated,
      budgetController.createBudget
   )

   app.get('/aft/api/v1/budget',
      authMiddleware.isAuthenticated,
      budgetController.getBudgets
   )

   app.get('/aft/api/v1/expenses/:id',
      authMiddleware.isAuthenticated,
      budgetController.getBudgetByid
   )

   app.patch('/aft/api/v1/expenses/:id',
      authMiddleware.isAuthenticated,
      budgetController.updateBudget
   )



}

module.exports = routes;