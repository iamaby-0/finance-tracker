const mongoose = require('mongoose')

const budegetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User'
    },

    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
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
            "Other",
            "Overall"
        ],
        default: 'Overall'
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    startDate: {
        required: true,
        type: Date
    },
    endDate: {
        type: Date,
        required: true
    },

    alertPercentage: {
        type: Number,
        min: 1,
        max: 100,
        default: 80
    },
    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })

budegetSchema.index({
    userId: 1,
    category: 1,
    month: 1,
    year: 1
}, {
    unique: true
})

const Budget = mongoose.model('Budget', budegetSchema)

module.exports = Budget