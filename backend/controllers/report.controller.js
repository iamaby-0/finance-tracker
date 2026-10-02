const reportService = require("../services/report.service");
const { successResponseBody, errorResponseBody } = require("../utils/responseBody");


const getMonthlyReport = async(req, res)=>{
    try{
        const userId = req.user.id;
        const { month, year } = req.query;

        if(!month || !year) {
            errorResponseBody.error = "Month and year are required";
            return res.status(400).json(errorResponseBody);
        }
        
        const report = await reportService.getMonthlyReports(userId, month, year);
        successResponseBody.data = report;
        successResponseBody.message = 'Monthly report generated successfully'

        return res.status(200).json(successResponseBody);
    }
    catch(error){
        errorResponseBody.error = error;

        return res.status(500).json(errorResponseBody)
    }
}


module.exports = {
    getMonthlyReport
}
