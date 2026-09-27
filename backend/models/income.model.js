const mongoose = require('mongoose')

const incomeSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required :true,
        ref : "User"
    },
    amount : {
        type : Number,
        required : true,
        min : [0,"Income cannot be negative"]
    },
    source : {
        type : String,
        required :true,
        enum : {
            values : [
                'Salary',
                'Freelance',
                'Business',
                'Investment',
                'Dividends',
                'Rental',
                "Parents",
                'Gift',
                'Other'
            ]
        },
        default :'Salary'
    },

     description : {
        type : String,
        trim : true,
        maxlength: 500,
        default : null
     },
     notes :{
        type :String,

     },
     date:{
        type: Date,
        required : true,
        default : Date.now
     }
},{timestamps :true})

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;