const Income = require('../models/income.model')

const create = async(userId, data)=>{
    try{
        const response = await Income.create({userId, ...data})

        if(!response ){
            throw{
                error : "cannot create income record",
                code : 404
            }
        }

        return response;
    }catch(error){
        console.log(error);
        throw error;
    }
}

module.exports = {
    create
}