const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getHarvests,
  createHarvest,
  deleteHarvest,
} = require("../controllers/harvestController");

const router = express.Router();

router.get("/", protect, getHarvests);
router.post("/", protect, createHarvest);
router.delete("/:id", protect, deleteHarvest);

module.exports = router;
