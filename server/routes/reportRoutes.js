const express = require("express");
const router = express.Router();

const {
  getReports,
} = require("../controllers/reportController");

// Get reports
router.get("/", getReports);

module.exports = router;