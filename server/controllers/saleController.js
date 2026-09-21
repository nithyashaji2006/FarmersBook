const Sale = require("../models/Sale");

// Add a new sale
const addSale = async (req, res) => {
  try {
    const { crop, buyer, quantity, pricePerKg, saleDate } = req.body;

    const totalIncome = quantity * pricePerKg;

    const sale = await Sale.create({
      crop,
      buyer,
      quantity,
      pricePerKg,
      totalIncome,
      saleDate,
    });

    res.status(201).json({
      message: "Sale recorded successfully",
      sale,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to record sale",
      error: error.message,
    });
  }
};

// Get all sales
const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ saleDate: -1 });

    res.status(200).json(sales);
  } catch (error) {
  console.error("GET SALES ERROR:", error);

  res.status(500).json({
    message: "Failed to fetch sales",
    error: error.message,
  });
}
};

module.exports = {
  addSale,
  getSales,
};