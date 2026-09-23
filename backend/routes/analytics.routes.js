const anlyitcsController = require('../controllers/analytics.controller')
const authMiddleware = require('../middlewares/auth.middlewares')


const routes = (app) =>{
    app.get('/aft/api/v1/analytics',
        authMiddleware.isAuthenticated,
        anlyitcsController.getMonthlySummary
    )
}

module.exports = routes;