const aiConroller = require("../controllers/ai.controller");
const authMiddleware= require('../middlewares/auth.middlewares');

const routes = (app) =>{
    app.get('/aft/api/v1/ai/financial-insights',
        authMiddleware.isAuthenticated,
        aiConroller.getFinancialInsights
    )
}

module.exports = routes;