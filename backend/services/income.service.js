const Income = require('../models/income.model')

const create = async (userId, data) => {
    try {
        const response = await Income.create({ userId, ...data })

        if (!response) {
            throw {
                error: "cannot create income record",
                code: 404
            }
        }

        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getIncomeById = async (id) => {
    try {
        const response = await Income.findById(id)
        if (!response) {
            throw { error: "Invalid Id , cannot find income details", code: 404 }
        }

        return response;
    }
    catch (error) {
        console.log(error);
        throw error
    }
}

const getAllIncome = async (userId) => {
    try {
        const response = await Income.find({
            userId
        }).sort({ date: -1 });

        return response
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

const updateIncome = async (id, newData) => {
    try {
        const response = await Income.findByIdAndUpdate(
            id,
            {
                $set: newData
            },
            {
                new: true,            // Returns the updated document
                runValidators: true
            }
        )

        if (!response) {
            throw { error: "invalid id for update ,cannot find income details ", code: 404 }
        }

        return response;
    }
    catch (error) {
        console.log(error)
        throw error;
    }
}

const deleteIncome = async (id) => {
    try {
        const response = await Income.findByIdAndDelete(id)

        if (!response) {
            throw {
                error: "cannot find income details to remove",
                code: 404
            }
        }
        return response;
    }
    catch (error) {
        console.log(error)
        throw error;
    }
}


module.exports = {
    create,
    getIncomeById,
    getAllIncome,
    updateIncome,
    deleteIncome

}