
const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : 2,
        maxlength : 20
    },

    email : {
        type : String,
        required : true,
        unique : true,
        match : [/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"]
    },

    password : {
        type : String,
        required : true
    },

    monthlyIncome : {
        type : Number,
        default : 0,
        min : 0
    },
    occupation : {
        type : String,
        required : true,
        enum : ["student", "employed", "unemployed"]
    },
    currency : {
        type : String,
        default : "INR "
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User;