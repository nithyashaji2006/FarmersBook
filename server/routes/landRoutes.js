const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createLand,
  getLands,
  getLandById,
  updateLand,
  deleteLand,
} = require("../controllers/landController");

const router = express.Router();

router.post("/", protect, createLand);
router.get("/", protect, getLands);
router.get("/:id", protect, getLandById);
router.put("/:id", protect, updateLand);
router.delete("/:id", protect, deleteLand);

module.exports = router;