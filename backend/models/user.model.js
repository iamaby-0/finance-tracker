const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },

    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"
        ]
    },

    password: {
        type: String,
        required: function () {
            return this.authProvider === "local";
        }
    },

    monthlyIncome: {
        type: Number,
        default: 0,
        min: 0
    },
    occupation: {
        type: String,
        enum: ["student", "employed", "unemployed"],
        default: "student"
    },
    currency: {
        type: String,
        default: "INR"
    },

    phoneNumber: {
        type: String,
        default: "+91 98765 43210"
    },
    dateOfBirth: {
        type: Date,
        default: new Date("2001-10-10")
    },
    country: {
        type: String,
        default: "India"
    },
    city: {
        type: String,
        default: "Greater Noida"
    },
    about: {
        type: String,
        default: "Managing my finances to build a better future.",
        maxlength: 200
    },
    dateFormat: {
        type: String,
        default: "DD/MM/YYYY"
    },
    firstDayOfWeek: {
        type: String,
        default: "Monday"
    },
    language: {
        type: String,
        enum: ["English"],
        default: "English"
    },
    theme: {
        type: String,
        default: "dark"
    },
    notifications: {
        expenseAlerts: { type: Boolean, default: true },
        savingsMilestones: { type: Boolean, default: true },
        weeklySummary: { type: Boolean, default: false },
        budgetReminders: { type: Boolean, default: true },
        goalUpdates: { type: Boolean, default: true },
        productUpdates: { type: Boolean, default: false }
    },

    googleId: {
        type: String,
        default: null,
        unique: true,
        sparse: true
    },

    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },

    profilePicture: {
        type: String,
        default: null
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;