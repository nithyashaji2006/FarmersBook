const Crop = require("../models/Crop");

// Get all crops for the logged-in user
const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(crops);
  } catch (error) {
    console.error("Get crops error:", error.message);
    res.status(500).json({
      message: "Server error fetching crops",
    });
  }
};

// Create a new crop for the logged-in user
const createCrop = async (req, res) => {
  try {
    const { cropName, availableStock } = req.body;

    if (!cropName || typeof cropName !== "string" || !cropName.trim()) {
      return res.status(400).json({
        message: "Please provide a valid crop name",
      });
    }

    const stockValue = availableStock !== undefined ? Number(availableStock) : 0;
    if (isNaN(stockValue) || stockValue < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative",
      });
    }

    const crop = await Crop.create({
      userId: req.user.userId,
      cropName: cropName.trim(),
      availableStock: stockValue,
    });

    res.status(201).json({
      message: "Crop added successfully",
      crop,
    });
  } catch (error) {
    console.error("Create crop error:", error.message);
    res.status(500).json({
      message: "Server error creating crop",
    });
  }
};

// Update an existing crop belonging to the logged-in user
const updateCrop = async (req, res) => {
  try {
    const { cropName, availableStock } = req.body;
    const updateData = {};

    if (cropName !== undefined) {
      if (typeof cropName !== "string" || !cropName.trim()) {
        return res.status(400).json({
          message: "Please provide a valid crop name",
        });
      }
      updateData.cropName = cropName.trim();
    }

    if (availableStock !== undefined) {
      const stockValue = Number(availableStock);
      if (isNaN(stockValue) || stockValue < 0) {
        return res.status(400).json({
          message: "Stock cannot be negative",
        });
      }
      updateData.availableStock = stockValue;
    }

    const crop = await Crop.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!crop) {
      return res.status(404).json({
        message: "Crop not found or unauthorized",
      });
    }

    res.status(200).json({
      message: "Crop updated successfully",
      crop,
    });
  } catch (error) {
    console.error("Update crop error:", error.message);
    res.status(500).json({
      message: "Server error updating crop",
    });
  }
};

// Delete crop belonging to the logged-in user
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!crop) {
      return res.status(404).json({
        message: "Crop not found or unauthorized",
      });
    }

    res.status(200).json({
      message: "Crop deleted successfully",
    });
  } catch (error) {
    console.error("Delete crop error:", error.message);
    res.status(500).json({
      message: "Server error deleting crop",
    });
  }
};

module.exports = {
  getCrops,
  createCrop,
  updateCrop,
  deleteCrop,
};
