const anlyitcsController = require('../controllers/analytics.controller')
const authMiddleware = require('../middlewares/auth.middlewares')
const analyticsMiddleware = require('../middlewares/analytics.middleware')

const routes = (app) =>{
    app.get('/aft/api/v1/analytics',
        authMiddleware.isAuthenticated,
        analyticsMiddleware.monthalySummaryRequest,
        anlyitcsController.getMonthlySummary
    )
}

module.exports = routes;