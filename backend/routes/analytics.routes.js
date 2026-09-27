const analyitcsController = require('../controllers/analytics.controller')
const authMiddleware = require('../middlewares/auth.middlewares')
const analyticsMiddleware = require('../middlewares/analytics.middleware')

const routes = (app) =>{
    app.get('/aft/api/v1/analytics/summary',
        authMiddleware.isAuthenticated,
        analyticsMiddleware.monthalySummaryRequest,
        analyitcsController.getMonthlySummary
    )

    app.get('/aft/api/v1/analytics/categories',
        authMiddleware.isAuthenticated,
        analyticsMiddleware.monthalySummaryRequest,
        analyitcsController.getMonthlySummary
    )

    app.get('/aft/api/v1/analytics/trends',
        authMiddleware.isAuthenticated,
        analyitcsController.getMonthlyTrend
    )

}

module.exports = routes;