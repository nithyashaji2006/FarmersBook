const Harvest = require("../models/Harvest");
const Crop = require("../models/Crop");

// Get all harvests for the logged-in user
const getHarvests = async (req, res) => {
  try {
    const harvests = await Harvest.find({
      userId: req.user.userId,
    })
      .populate("cropId", "cropName availableStock")
      .sort({ harvestDate: -1 });

    res.status(200).json(harvests);
  } catch (error) {
    console.error("Get harvests error:", error.message);
    res.status(500).json({
      message: "Server error fetching harvests",
    });
  }
};

// Record a new harvest and atomically update crop stock
const createHarvest = async (req, res) => {
  try {
    const { cropId, quantity, harvestDate } = req.body;

    // 1. Validate cropId
    if (!cropId) {
      return res.status(400).json({
        message: "Please select a valid crop",
      });
    }

    // 2. Validate quantity (must be > 0)
    const qtyNum = Number(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      return res.status(400).json({
        message: "Harvest quantity must be greater than 0",
      });
    }

    // 3. Validate harvestDate
    if (!harvestDate || isNaN(new Date(harvestDate).getTime())) {
      return res.status(400).json({
        message: "Please provide a valid harvest date",
      });
    }

    // 4. Confirm the crop belongs to the logged-in user
    const crop = await Crop.findOne({
      _id: cropId,
      userId: req.user.userId,
    });

    if (!crop) {
      return res.status(404).json({
        message: "Crop not found or does not belong to logged-in user",
      });
    }

    // 5. Create harvest record
    const harvest = await Harvest.create({
      userId: req.user.userId,
      cropId,
      quantity: qtyNum,
      harvestDate: new Date(harvestDate),
    });

    // 6. Automatically increase that crop's availableStock by harvested quantity (atomic database-consistent update)
    const updatedCrop = await Crop.findOneAndUpdate(
      {
        _id: cropId,
        userId: req.user.userId,
      },
      {
        $inc: { availableStock: qtyNum },
      },
      { new: true }
    );

    res.status(201).json({
      message: "Harvest recorded successfully",
      harvest,
      updatedCrop,
    });
  } catch (error) {
    console.error("Create harvest error:", error.message);
    res.status(500).json({
      message: "Server error recording harvest",
    });
  }
};

// Delete a harvest record and deduct quantity from crop stock
const deleteHarvest = async (req, res) => {
  try {
    const harvest = await Harvest.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!harvest) {
      return res.status(404).json({
        message: "Harvest record not found or unauthorized",
      });
    }

    // Safely reduce the stock by the harvested quantity (without letting it drop below 0)
    const crop = await Crop.findOne({ _id: harvest.cropId, userId: req.user.userId });
    if (crop) {
      const newStock = Math.max(0, crop.availableStock - harvest.quantity);
      await Crop.updateOne({ _id: crop._id }, { availableStock: newStock });
    }

    res.status(200).json({
      message: "Harvest record deleted and stock adjusted",
    });
  } catch (error) {
    console.error("Delete harvest error:", error.message);
    res.status(500).json({
      message: "Server error deleting harvest record",
    });
  }
};

module.exports = {
  getHarvests,
  createHarvest,
  deleteHarvest,
};
