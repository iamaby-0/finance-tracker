const budgetController = require('../controllers/budget.controller')
const authMiddleware = require('../middlewares/auth.middlewares')
const budgetMiddleware = require('../middlewares/budget.middleware')



const routes = (app) => {
   app.post('/aft/api/v1/budget',
      authMiddleware.isAuthenticated,
      budgetMiddleware.budgetCreateRequest,
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

   app.delete('/aft/api/v1/expenses/:id',
      authMiddleware.isAuthenticated,
      budgetController.deleteBudget
   )


}

module.exports = routes;