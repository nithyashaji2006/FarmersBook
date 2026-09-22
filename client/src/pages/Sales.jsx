import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Sales.css";

function Sales() {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    cropId: "",
    buyer: "",
    quantity: "",
    pricePerKg: "",
    saleDate: "",
  });

  const [crops, setCrops] = useState([]);
  const [sales, setSales] = useState([]);

  const [message, setMessage] = useState("");
  const [editingSaleId, setEditingSaleId] = useState(null);

  // Calculate total income
  const totalIncome =
    Number(formData.quantity || 0) * Number(formData.pricePerKg || 0);

  // ==========================================
  // GET CROPS
  // ==========================================

  const fetchCrops = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/crops", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCrops(data);
      } else {
        setMessage(data.message || "Failed to fetch crops");
      }
    } catch (error) {
      console.error("FETCH CROPS ERROR:", error);
      setMessage("Unable to fetch crops");
    }
  };

  // ==========================================
  // GET SALES
  // ==========================================

  const fetchSales = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/sales", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSales(data);
      } else {
        setMessage(data.message || "Failed to fetch sales");
      }
    } catch (error) {
      console.error("FETCH SALES ERROR:", error);
      setMessage("Unable to fetch sales");
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    if (token) {
      fetchCrops();
      fetchSales();
    }
  }, [token]);

  // ==========================================
  // SELECTED CROP
  // ==========================================

  const selectedCrop = crops.find((crop) => crop._id === formData.cropId);

  // ==========================================
  // SALE BEING EDITED
  // ==========================================

  const editingSale = sales.find((sale) => sale._id === editingSaleId);

  /*
    IMPORTANT:

    If editing a sale, its quantity has already
    been deducted from the current crop stock.

    Example:

    Original stock = 15
    Old sale = 10
    Current stock = 5

    While editing:
    5 + 10 = 15 available

    If the crop is changed to another crop,
    we do NOT add the old quantity because
    the old quantity belongs to the old crop.
  */

  const availableStockForSale = selectedCrop
    ? Number(selectedCrop.availableStock) +
      (editingSale && editingSale.cropId === selectedCrop._id
        ? Number(editingSale.quantity)
        : 0)
    : 0;

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ==========================================
  // HANDLE CROP CHANGE
  // ==========================================

  const handleCropChange = (e) => {
    const cropId = e.target.value;

    setFormData({
      ...formData,
      cropId,
      quantity: "",
    });
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      cropId: "",
      buyer: "",
      quantity: "",
      pricePerKg: "",
      saleDate: "",
    });

    setEditingSaleId(null);
  };

  // ==========================================
  // ADD / UPDATE SALE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!formData.cropId) {
      setMessage("Please select a crop.");
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      setMessage("Please enter a valid quantity.");
      return;
    }

    /*
      Frontend stock validation.

      During editing, availableStockForSale
      already includes the old sale quantity.
    */

    if (selectedCrop && Number(formData.quantity) > availableStockForSale) {
      setMessage(
        `Insufficient stock. Available stock is ${availableStockForSale} kg.`,
      );
      return;
    }

    try {
      const url = editingSaleId
        ? `http://localhost:5000/api/sales/${editingSaleId}`
        : "http://localhost:5000/api/sales";

      const method = editingSaleId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cropId: formData.cropId,
          buyer: formData.buyer,
          quantity: Number(formData.quantity),
          pricePerKg: Number(formData.pricePerKg),
          saleDate: formData.saleDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          editingSaleId
            ? "Sale updated successfully!"
            : "Sale recorded successfully!",
        );

        resetForm();

        await fetchSales();
        await fetchCrops();
      } else {
        setMessage(
          data.message ||
            (editingSaleId ? "Failed to update sale" : "Failed to record sale"),
        );
      }
    } catch (error) {
      console.error("SALE ERROR:", error);

      setMessage("Server error. Please try again.");
    }
  };

  // ==========================================
  // EDIT SALE
  // ==========================================

  const handleEdit = (sale) => {
    /*
      Old sales created before cropId was added
      cannot be edited using the new stock system.
    */

    if (!sale.cropId) {
      setMessage(
        "This old sale cannot be edited because it is not linked to a crop.",
      );
      return;
    }

    setEditingSaleId(sale._id);

    setFormData({
      cropId: sale.cropId,
      buyer: sale.buyer,
      quantity: sale.quantity,
      pricePerKg: sale.pricePerKg,
      saleDate: sale.saleDate
        ? new Date(sale.saleDate).toISOString().split("T")[0]
        : "",
    });

    setMessage("Editing sale. Update the details and save.");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE SALE
  // ==========================================

  const handleDelete = async (saleId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this sale?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/sales/${saleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Sale deleted successfully!");

        await fetchSales();
        await fetchCrops();
      } else {
        setMessage(data.message || "Failed to delete sale");
      }
    } catch (error) {
      console.error("DELETE SALE ERROR:", error);

      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="sales-page">
      {/* Page Header */}
      <div className="sales-header">
        <div>
          <p className="page-label">SALES MANAGEMENT</p>

          <h1>Sales</h1>

          <p className="page-subtitle">Record and manage your crop sales</p>
        </div>
      </div>

      {/* Record / Edit Sale Card */}
      <section className="sales-card">
        <div className="section-heading">
          <div className="section-icon">💰</div>

          <div>
            <h2>{editingSaleId ? "Edit Crop Sale" : "Record Crop Sale"}</h2>

            <p>
              {editingSaleId
                ? "Update the details of this sale."
                : "Enter the details of your latest crop sale."}
            </p>
          </div>
        </div>

        <form className="sales-form" onSubmit={handleSubmit}>
          {/* Crop + Buyer */}
          <div className="form-row">
            <div className="sales-field">
              <label>Crop</label>

              <select
                name="cropId"
                value={formData.cropId}
                onChange={handleCropChange}
                required
              >
                <option value="">Select crop</option>

                {crops.map((crop) => (
                  <option key={crop._id} value={crop._id}>
                    {crop.cropName}
                  </option>
                ))}
              </select>

              {selectedCrop && (
                <small>
                  Available stock: <strong>{availableStockForSale} kg</strong>
                </small>
              )}
            </div>

            <div className="sales-field">
              <label>Buyer</label>

              <input
                type="text"
                name="buyer"
                value={formData.buyer}
                onChange={handleChange}
                placeholder="Enter buyer name"
                required
              />
            </div>
          </div>

          {/* Quantity + Price */}
          <div className="form-row">
            <div className="sales-field">
              <label>Quantity (kg)</label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                placeholder="Enter quantity"
                required
              />
            </div>

            <div className="sales-field">
              <label>Price per kg (₹)</label>

              <input
                type="number"
                name="pricePerKg"
                value={formData.pricePerKg}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter price"
                required
              />
            </div>
          </div>

          {/* Sale Date */}
          <div className="sales-field">
            <label>Sale Date</label>

            <input
              type="date"
              name="saleDate"
              value={formData.saleDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Total Income */}
          <div className="income-box">
            <div>
              <span>Total Income</span>

              <small>Quantity × Price per kg</small>
            </div>

            <strong>₹{totalIncome.toLocaleString("en-IN")}</strong>
          </div>

          {/* Form Buttons */}
          <div className="sale-form-actions">
            <button type="submit" className="record-sale-button">
              {editingSaleId ? "Update Sale" : "Record Sale"}
            </button>

            {editingSaleId && (
              <button
                type="button"
                className="cancel-edit-button"
                onClick={() => {
                  resetForm();
                  setMessage("");
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {message && (
          <p
            className={
              message.includes("successfully")
                ? "sales-message success"
                : "sales-message error"
            }
          >
            {message}
          </p>
        )}
      </section>

      {/* Sales History */}
      <section className="history-section">
        <div className="section-heading">
          <div className="section-icon">📋</div>

          <div>
            <h2>Sales History</h2>

            <p>View and manage your previously recorded sales.</p>
          </div>
        </div>

        {sales.length === 0 ? (
          <div className="empty-sales">
            <div>📦</div>

            <p>No sales recorded yet.</p>

            <span>Your recorded sales will appear here.</span>
          </div>
        ) : (
          <div className="sales-table-wrapper">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Buyer</th>
                  <th>Quantity</th>
                  <th>Price / kg</th>
                  <th>Total Income</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {sales.map((sale) => (
                  <tr key={sale._id}>
                    <td className="crop-name">🌾 {sale.crop}</td>

                    <td>{sale.buyer}</td>

                    <td>{sale.quantity} kg</td>

                    <td>₹{sale.pricePerKg}</td>

                    <td className="income-value">₹{sale.totalIncome}</td>

                    <td>
                      {new Date(sale.saleDate).toLocaleDateString("en-IN")}
                    </td>

                    <td className="sale-actions">
                      <button
                        type="button"
                        className="edit-sale-button"
                        onClick={() => handleEdit(sale)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-sale-button"
                        onClick={() => handleDelete(sale._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Sales;
