const Sale = require("../models/Sale");
const Crop = require("../models/Crop");

// ==========================================
// ADD SALE
// ==========================================

const addSale = async (req, res) => {
  try {
    const {
      cropId,
      buyer,
      quantity,
      pricePerKg,
      saleDate,
    } = req.body;

    const qty = Number(quantity);
    const price = Number(pricePerKg);

    // Validate required fields
    if (!cropId || !buyer || !saleDate) {
      return res.status(400).json({
        message: "Crop, buyer and sale date are required",
      });
    }

    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        message: "Price per kg cannot be negative",
      });
    }

    // Find crop belonging to logged-in user
    const crop = await Crop.findOne({
      _id: cropId,
      userId: req.user.userId,
    });

    if (!crop) {
      return res.status(404).json({
        message: "Crop not found or unauthorized",
      });
    }

    // Check available stock
    if (qty > crop.availableStock) {
      return res.status(400).json({
        message: `Insufficient stock. Available stock is ${crop.availableStock} kg`,
      });
    }

    const totalIncome = qty * price;

    // Reduce stock
    crop.availableStock -= qty;
    await crop.save();

    try {
      // Create sale
      const sale = await Sale.create({
        user: req.user.userId,
        cropId: crop._id,
        crop: crop.cropName,
        buyer,
        quantity: qty,
        pricePerKg: price,
        totalIncome,
        saleDate,
      });

      res.status(201).json({
        message: "Sale recorded successfully",
        sale,
        updatedStock: crop.availableStock,
      });
    } catch (saleError) {
      // If sale creation fails, restore stock
      crop.availableStock += qty;
      await crop.save();

      throw saleError;
    }
  } catch (error) {
    console.error("ADD SALE ERROR:", error);

    res.status(500).json({
      message: "Failed to record sale",
      error: error.message,
    });
  }
};


// ==========================================
// GET SALES
// ==========================================

const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({
      user: req.user.userId,
    }).sort({ saleDate: -1 });

    res.status(200).json(sales);
  } catch (error) {
    console.error("GET SALES ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch sales",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE SALE
// ==========================================

const updateSale = async (req, res) => {
  try {
    const {
      cropId,
      buyer,
      quantity,
      pricePerKg,
      saleDate,
    } = req.body;

    const newQuantity = Number(quantity);
    const newPrice = Number(pricePerKg);

    // Validate fields
    if (!cropId || !buyer || !saleDate) {
      return res.status(400).json({
        message: "Crop, buyer and sale date are required",
      });
    }

    if (isNaN(newQuantity) || newQuantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    if (isNaN(newPrice) || newPrice < 0) {
      return res.status(400).json({
        message: "Price per kg cannot be negative",
      });
    }

    // Find existing sale
    const sale = await Sale.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!sale) {
      return res.status(404).json({
        message: "Sale not found",
      });
    }

    /*
      STEP 1:
      Restore the quantity from the OLD sale.

      Example:

      Original stock = 15 kg
      Old sale = 10 kg
      Current stock = 5 kg

      While editing:
      5 + 10 = 15 kg available again
    */

    const oldCrop = await Crop.findOne({
      _id: sale.cropId,
      userId: req.user.userId,
    });

    if (oldCrop) {
      oldCrop.availableStock += sale.quantity;
      await oldCrop.save();
    }

    /*
      STEP 2:
      Now fetch the crop again AFTER restoring
      the old sale quantity.

      This is important when editing the same crop.
    */

    const newCrop = await Crop.findOne({
      _id: cropId,
      userId: req.user.userId,
    });

    if (!newCrop) {
      // If the new crop doesn't exist, restore the
      // original stock adjustment before returning.
      if (oldCrop) {
        oldCrop.availableStock -= sale.quantity;
        await oldCrop.save();
      }

      return res.status(404).json({
        message: "Crop not found or unauthorized",
      });
    }

    /*
      STEP 3:
      Check the new quantity against the restored stock.
    */

    if (newQuantity > newCrop.availableStock) {
      // Restore original state
      if (oldCrop) {
        oldCrop.availableStock -= sale.quantity;
        await oldCrop.save();
      }

      return res.status(400).json({
        message: `Insufficient stock. Available stock is ${newCrop.availableStock} kg`,
      });
    }

    /*
      STEP 4:
      Deduct the new sale quantity.
    */

    newCrop.availableStock -= newQuantity;
    await newCrop.save();

    /*
      STEP 5:
      Update sale information.
    */

    const totalIncome = newQuantity * newPrice;

    sale.cropId = newCrop._id;
    sale.crop = newCrop.cropName;
    sale.buyer = buyer;
    sale.quantity = newQuantity;
    sale.pricePerKg = newPrice;
    sale.totalIncome = totalIncome;
    sale.saleDate = saleDate;

    await sale.save();

    res.status(200).json({
      message: "Sale updated successfully",
      sale,
      updatedStock: newCrop.availableStock,
    });
  } catch (error) {
    console.error("UPDATE SALE ERROR:", error);

    res.status(500).json({
      message: "Failed to update sale",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE SALE
// ==========================================

const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!sale) {
      return res.status(404).json({
        message: "Sale not found",
      });
    }

    /*
      When deleting a sale, return the sold
      quantity back to available stock.
    */

    const crop = await Crop.findOne({
      _id: sale.cropId,
      userId: req.user.userId,
    });

    if (crop) {
      crop.availableStock += sale.quantity;
      await crop.save();
    }

    await Sale.deleteOne({
      _id: sale._id,
    });

    res.status(200).json({
      message: "Sale deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SALE ERROR:", error);

    res.status(500).json({
      message: "Failed to delete sale",
      error: error.message,
    });
  }
};


module.exports = {
  addSale,
  getSales,
  updateSale,
  deleteSale,
};