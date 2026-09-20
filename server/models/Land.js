const mongoose = require("mongoose");

const landSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    area: {
      type: Number,
      required: true,
      min: 0,
    },

    plantationYear: {
      type: Number,
      required: true,
    },

    soilType: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Land", landSchema);