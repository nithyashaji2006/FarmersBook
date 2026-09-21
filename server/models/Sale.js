const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    crop: {
      type: String,
      required: true,
    },

    buyer: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    pricePerKg: {
      type: Number,
      required: true,
      min: 0,
    },

    totalIncome: {
      type: Number,
      required: true,
      min: 0,
    },

    saleDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sale", saleSchema);