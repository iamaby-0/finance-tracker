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
const goalRoutes = require('./routes/goal.routes')
const userRoutes = require('./routes/user.routes')
const passport = require('./config/passport');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
    origin: [
        "https://my-finance-tracker-omega-ten-32.vercel.app",
        "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(passport.initialize());
authRoutes(app); // invoking auth routes
expenseRoutes(app) // calling expense routes
incomeRoutes(app) // calling income routes
budgetRoutes(app) // calling budget routes
analyticsRoutes(app) // calling analytics routes
reportRoutes(app) // calling report routes
aiRoutes(app) // calling ai routes
categoryRoutes(app) // calling category routes
goalRoutes(app) // calling goal routes
userRoutes(app); // calling user routes


app.listen(env.port, () => {
    console.log("Server running on " + env.port);
    connectDB();
})