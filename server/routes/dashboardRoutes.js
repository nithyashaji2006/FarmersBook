const express = require("express");
const router = express.Router();

const {
  getDashboard,
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");

// Get dashboard data for logged-in user
router.get("/", protect, getDashboard);

module.exports = router;