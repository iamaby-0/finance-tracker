const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const connectDB = require("./config/db");
const authRoutes = require('./routes/auth.routes')
const expenseRoutes = require('./routes/expense.routes')
const incomeRoutes = require('./routes/income.routes')
const budgetRoutes = require('./routes/budget.routes')
const analyticsRoutes = require('./routes/analytics.routes')
const reportRoutes = require('./routes/report.routes')
const aiRoutes = require('./routes/ai.routes')
const categoryRoutes = require('./routes/category.routes')
const passport = require('./config/passport');

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
}))
app.use(passport.initialize());
authRoutes(app); // invoking auth routes
expenseRoutes(app) // calling expense routes
incomeRoutes(app) // calling income routes
budgetRoutes(app) // calling budget routes
analyticsRoutes(app) // calling analytics routes
reportRoutes(app) // calling report routes
aiRoutes(app) // calling ai routes
categoryRoutes(app) // calling category routes


app.listen(env.port, ()=>{
    console.log("Server running on " + env.port);
    connectDB();
})