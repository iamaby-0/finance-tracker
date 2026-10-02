const reportController = require("../controllers/report.controller");
const authMiddleware = require("../middlewares/auth.middlewares");

const routes = (app) => {
    app.get('/aft/api/v1/report/monthly-report',
        authMiddleware.isAuthenticated,
        reportController.getMonthlyReport
    )
}   


module.exports = routes;
