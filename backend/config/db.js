const mongoose = require("mongoose");
const env = require("./env");


const connectBD = async() =>{
    try{
        const connection = await mongoose.connect(env.db_url);
        console.log("Successfully Connected to MongoDB")
    }
    catch(error){
        console.log(error);
    }
}

module.exports = connectBD;