const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./DatabaseConfig.js')
const authRoutes = require('./routes/auth.route');
const expenseRoutes = require('./routes/expense.route');
const incomeRoutes = require('./routes/income.route');
const budgetRoutes = require('./routes/budget.route');
const savingsRoutes = require('./routes/saving.route');

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
})); // Enable CORS for frontend communication


connectDB();
// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/expense', expenseRoutes); // Expense routes
app.use('/api/income', incomeRoutes); // Income routes
app.use('/api/budget', budgetRoutes); // Budget routes
app.use('/api/savings', savingsRoutes); // Savings routes

app.listen(5050, () => {
  console.log(`Server running`);
});