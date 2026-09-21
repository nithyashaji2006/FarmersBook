const Expense = require("../models/Expense");

// Add a new expense
const createExpense = async (req, res) => {
  try {
const userId = req.user.userId;
    const { category, amount, date } = req.body;

    if (!category || amount === undefined || amount === "") {
      return res.status(400).json({
        message: "Category and amount are required",
      });
    }

    const expense = await Expense.create({
      user: userId,
      category: category,
      amount: Number(amount),
      date: date || new Date(),
    });

    console.log("Expense created successfully:", expense);

    res.status(201).json(expense);
  } catch (error) {
    console.error("CREATE EXPENSE ERROR:", error);

    res.status(500).json({
      message: "Failed to create expense",
      error: error.message,
    });
  }
};

// Get all expenses of the logged-in user
const getExpenses = async (req, res) => {
  try {
const userId = req.user.userId;
    const expenses = await Expense.find({
      user: userId,
    }).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.error("GET EXPENSES ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch expenses",
      error: error.message,
    });
  }
};

// Get one expense
const getExpenseById = async (req, res) => {
  try {
const userId = req.user.userId;
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error("GET EXPENSE ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch expense",
      error: error.message,
    });
  }
};

// Update an expense
const updateExpense = async (req, res) => {
  try {
const userId = req.user.userId;
    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        user: userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error("UPDATE EXPENSE ERROR:", error);

    res.status(500).json({
      message: "Failed to update expense",
      error: error.message,
    });
  }
};

// Delete an expense
const deleteExpense = async (req, res) => {
  try {
const userId = req.user.userId;
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("DELETE EXPENSE ERROR:", error);

    res.status(500).json({
      message: "Failed to delete expense",
      error: error.message,
    });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};