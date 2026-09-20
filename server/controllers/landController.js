const Land = require("../models/Land");

// Create a new land
const createLand = async (req, res) => {
  try {
    const { location, area, plantationYear, soilType } = req.body;

    if (!location || !area || !plantationYear || !soilType) {
      return res.status(400).json({
        message: "Please provide all land details",
      });
    }

    const land = await Land.create({
      user: req.user.userId,
      location,
      area,
      plantationYear,
      soilType,
    });

    res.status(201).json({
      message: "Land added successfully",
      land,
    });
  } catch (error) {
    console.error("Create land error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get all lands of the logged-in user
const getLands = async (req, res) => {
  try {
    const lands = await Land.find({
      user: req.user.userId,
    });

    res.status(200).json(lands);
  } catch (error) {
    console.error("Get lands error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get one land
const getLandById = async (req, res) => {
  try {
    const land = await Land.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!land) {
      return res.status(404).json({
        message: "Land not found",
      });
    }

    res.status(200).json(land);
  } catch (error) {
    console.error("Get land error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update land
const updateLand = async (req, res) => {
  try {
    const { location, area, plantationYear, soilType } = req.body;

    const land = await Land.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        location,
        area,
        plantationYear,
        soilType,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!land) {
      return res.status(404).json({
        message: "Land not found",
      });
    }

    res.status(200).json({
      message: "Land updated successfully",
      land,
    });
  } catch (error) {
    console.error("Update land error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Delete land
const deleteLand = async (req, res) => {
  try {
    const land = await Land.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!land) {
      return res.status(404).json({
        message: "Land not found",
      });
    }

    res.status(200).json({
      message: "Land deleted successfully",
    });
  } catch (error) {
    console.error("Delete land error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createLand,
  getLands,
  getLandById,
  updateLand,
  deleteLand,
};