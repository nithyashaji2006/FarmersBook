const express = require("express");
const router = express.Router();

const {
  addSale,
  getSales,
} = require("../controllers/saleController");

// Add a new sale
router.post("/", addSale);

// Get all sales
router.get("/", getSales);

module.exports = router;