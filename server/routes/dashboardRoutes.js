const express = require("express");
const router = express.Router();

const {
  getDashboard,
} = require("../controllers/dashboardController");

// Get dashboard data
router.get("/", getDashboard);

module.exports = router;