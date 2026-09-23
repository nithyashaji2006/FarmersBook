const Sale = require("../models/Sale");
const Expense = require("../models/Expense");

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get logged-in user's sales
    const sales = await Sale.find({ user: userId });

    const totalIncome = sales.reduce(
      (sum, sale) => sum + sale.totalIncome,
      0
    );

    // Get logged-in user's expenses
    const expenses = await Expense.find({ user: userId });

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Calculate profit/loss
    const profitLoss = totalIncome - totalExpenses;

    // Get recent sales
    const recentSales = await Sale.find({ user: userId })
      .sort({ saleDate: -1 })
      .limit(5);

    res.status(200).json({
      totalIncome,
      totalExpenses,
      profitLoss,
      recentSales,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};

module.exports = { getDashboard };