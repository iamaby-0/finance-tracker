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

const getbudgets = async (userId, filters = {}) => {
    try {
        const query = { userId }

        if (filters.month) {
            query.month = filters.month
        }


        if (filters.year) {
            query.year = filters.year
        }


        if (filters.category) {
            query.category = filters.category
        }

        console.log("QUERY:", query);


        const response = await Budget.find(query)

        console.log(response)



        return response;
    }
    catch (error) {
        console.log(error);
        throw error
    }
}

const getBudgetById = async (id) => {
    try {
        const response = await Budget.findOne({ id });
        if (!response) {
            throw {
                error: "invalid budget id",
                code: 404
            }
        }
        return response
    }
    catch (error) {
        console.log(error)
        throw error;
    }
}

const updateBudget = async (id, newData) => {
    try {
        const response = await Budget.findByIdAndUpdate(
            id,
            { $set: newData },
            {
                returnDocument: 'after',
                runValidators: true
            }
        )

        if (!response) {
            throw {
                error: "invalid id , cannot find budget",
                code: 404
            }
        }

        return response;
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

const deleteBudget = async (id) => {
    try {
        const response = await Budget.findByIdAndDelete(id)

        if (!response) {
            throw {
                error: "invalid id , cannot find Budget",
                code: 404
            }
        }

        return response;
    }
    catch (error) {
        console.log(error)
        throw error
    }
}


module.exports = {
    createBudget,
    getbudgets,
    getBudgetById,
    updateBudget,
    deleteBudget

}