const Budget = require('../models/budget.model')

const createBudget = async (userId, data) => {
    try {

        const { userId, category, month, year } = data;

        const existingBudget = await Budget.findOne({
            category,
            month,
            year
        })

        if (existingBudget) {
            throw new Error(
                `Budget already exists for ${category} in ${month}/${year}`
            );
        }
        
        const response = await Budget.create({ userId, ...data })

        return response;
    }
    catch (error) {
        console.log(error);
        if (error.name == "ValidationError") {
            let err = {};
            Object.keys(error.errors).forEach((keys) => {
                err[keys] = error.errors[keys].message
            });

            throw {
                error: err, code: 400
            }
        }
        throw error;
    }
}

module.exports = {
    createBudget
}