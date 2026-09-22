const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getCrops,
  createCrop,
  updateCrop,
  deleteCrop,
} = require("../controllers/cropController");

const router = express.Router();

router.get("/", protect, getCrops);
router.post("/", protect, createCrop);
router.put("/:id", protect, updateCrop);
router.delete("/:id", protect, deleteCrop);

module.exports = router;
