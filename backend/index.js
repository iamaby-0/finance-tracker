const express = require("express");
const env = require("./config/env");
const connectDB = require("./config/db");
const authRoutes = require('./routes/auth.routes')
const expenseRoutes = require('./routes/expense.routes')
const incomeRoutes = require('./routes/income.routes')
const budgetRoutes = require('./routes/budget.routes')
const analyticsRoutes = require('./routes/analytics.routes')

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended : true}))

authRoutes(app); // invoking auth routes
expenseRoutes(app) // calling expense routes
incomeRoutes(app)
budgetRoutes(app)
analyticsRoutes(app)


app.listen(env.port, ()=>{
    console.log("Server running on " + env.port);
    connectDB();
})