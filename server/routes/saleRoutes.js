const express = require("express");

const router = express.Router();

const {
  addSale,
  getSales,
  updateSale,
  deleteSale,
} = require("../controllers/saleController");

const protect = require("../middleware/authMiddleware");

// Add sale
router.post("/", protect, addSale);

// Get logged-in user's sales
router.get("/", protect, getSales);

// Update sale
router.put("/:id", protect, updateSale);

// Delete sale
router.delete("/:id", protect, deleteSale);

module.exports = router;