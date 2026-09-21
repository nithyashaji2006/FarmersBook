const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const router = express.Router();

router.post("/", protect, createExpense);

router.get("/", protect, getExpenses);

router.get("/:id", protect, getExpenseById);

router.put("/:id", protect, updateExpense);

router.delete("/:id", protect, deleteExpense);

module.exports = router;