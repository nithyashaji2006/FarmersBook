const Sale = require("../models/Sale");

// Get financial reports for logged-in user
const getReports = async (req, res) => {
  try {
    const sales = await Sale.find({
      user: req.user.userId,
    }).sort({ saleDate: -1 });

    const totalIncome = sales.reduce(
      (sum, sale) => sum + sale.totalIncome,
      0
    );

    const cropSales = {};

    sales.forEach((sale) => {
      if (!cropSales[sale.crop]) {
        cropSales[sale.crop] = {
          crop: sale.crop,
          quantity: 0,
          income: 0,
        };
      }

      cropSales[sale.crop].quantity += sale.quantity;
      cropSales[sale.crop].income += sale.totalIncome;
    });

    res.status(200).json({
      totalIncome,
      totalExpenses: 0,
      profitLoss: totalIncome,
      cropSales: Object.values(cropSales),
      sales,
    });
  } catch (error) {
    console.error("REPORT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};

module.exports = {
  getReports,
};