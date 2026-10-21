const budgetController = require('../controllers/budget.controller')
const authMiddleware = require('../middlewares/auth.middlewares')
const budgetMiddleware = require('../middlewares/budget.middleware')



const routes = (app) => {
   app.post(['/aft/api/v1/budget', '/aft/api/v1/budgets'],
      authMiddleware.isAuthenticated,
      budgetMiddleware.budgetCreateRequest,
      budgetController.createBudget
   )

   app.get(['/aft/api/v1/budget', '/aft/api/v1/budgets'],
      authMiddleware.isAuthenticated,
      budgetController.getBudgets
   )

   app.get(['/aft/api/v1/budget/:id', '/aft/api/v1/budgets/:id'],
      authMiddleware.isAuthenticated,
      budgetController.getBudgetByid
   )

   app.patch(['/aft/api/v1/budget/:id', '/aft/api/v1/budgets/:id'],
      authMiddleware.isAuthenticated,
      budgetController.updateBudget
   )

   app.delete(['/aft/api/v1/budget/:id', '/aft/api/v1/budgets/:id'],
      authMiddleware.isAuthenticated,
      budgetController.deleteBudget
   )


}

module.exports = routes;