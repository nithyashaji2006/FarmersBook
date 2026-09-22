const Sale = require("../models/Sale");

// Get dashboard summary for logged-in user
const getDashboard = async (req, res) => {
  try {
    const sales = await Sale.find({
      user: req.user.userId,
    });

    const totalIncome = sales.reduce(
      (sum, sale) => sum + sale.totalIncome,
      0
    );

    const recentSales = await Sale.find({
      user: req.user.userId,
    })
      .sort({ saleDate: -1 })
      .limit(5);

    res.status(200).json({
      totalIncome,
      totalExpenses: 0,
      profitLoss: totalIncome,
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

module.exports = {
  getDashboard,
};