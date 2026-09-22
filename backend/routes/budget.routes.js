const budgetController = require('../controllers/budget.controller')
const authMiddleware = require('../middlewares/auth.middlewares')

const routes = (app) =>{
   app.post('/aft/api/v1/budget',
          authMiddleware.isAuthenticated,
          budgetController.createBudget
       )
}

module.exports = routes;