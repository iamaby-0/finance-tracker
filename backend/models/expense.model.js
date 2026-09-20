const mongoose = require("mongoose");


const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    amount: {
        type: Number,
        required: true,
        min: [0, "Amount cannot be negative"]
    },
    description: {
        type: String,
        enum: [
            "Food",
            "Transport",
            "Shopping",
            "Entertainment",
            "Bills",
            "Health",
            "Education",
            "Travel",
            "Rent",
            "Investment",
            "Other"
        ],
        default: "Other"
    },
    subCategory : {
        type : String,
        trim : true,
        default : null
    },
    paymentMethod : {
        type : String,
        enum : ['Cash','UPI','Debit Card','Bank Transfer','Other'],
        default : 'UPI'
    },
    date :{
        type : Date,
        required : true,
        default : Date.now
    },

    notes : {
        type : String,
        maxlength : 500,
        default : null
    },
    aiCategorized : {
        type :Boolean,
        default : false
    },

    aiConfidence: {
        type : Number,
        min : 0,
        max : 1,
        default : null
    }
},{timestamps : true});

const Expense = mongoose.module('Expense', expenseSchema);

module.exports = Expense;