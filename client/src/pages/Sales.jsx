import { useEffect, useState } from "react";
import "./Sales.css";

function Sales() {
  const [formData, setFormData] = useState({
    crop: "",
    buyer: "",
    quantity: "",
    pricePerKg: "",
    saleDate: "",
  });

  const [sales, setSales] = useState([]);
  const [message, setMessage] = useState("");

  // Calculate total income
  const totalIncome =
    Number(formData.quantity || 0) *
    Number(formData.pricePerKg || 0);

  // Get sales history
  const fetchSales = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/sales");
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error("Failed to fetch sales:", error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit sale
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Sale recorded successfully!");

        setFormData({
          crop: "",
          buyer: "",
          quantity: "",
          pricePerKg: "",
          saleDate: "",
        });

        fetchSales();
      } else {
        setMessage(data.message || "Failed to record sale");
      }
    } catch (error) {
      console.error(error);
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
          <p className="page-subtitle">
            Record and manage your crop sales
          </p>
        </div>
      </div>

      {/* Record Sale Card */}
      <section className="sales-card">
        <div className="section-heading">
          <div className="section-icon">💰</div>

          <div>
            <h2>Record Crop Sale</h2>
            <p>Enter the details of your latest crop sale.</p>
          </div>
        </div>

        <form className="sales-form" onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="sales-field">
              <label>Crop</label>
              <input
                type="text"
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                placeholder="Enter crop name"
                required
              />
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

          <div className="form-row">

            <div className="sales-field">
              <label>Quantity (kg)</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
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
                placeholder="Enter price"
                required
              />
            </div>

          </div>

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
              <small>
                Quantity × Price per kg
              </small>
            </div>

            <strong>₹{totalIncome.toLocaleString("en-IN")}</strong>
          </div>

          <button
            type="submit"
            className="record-sale-button"
          >
            Record Sale
          </button>
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
            <p>View your previously recorded sales.</p>
          </div>
        </div>

        {sales.length === 0 ? (
          <div className="empty-sales">
            <div>📦</div>
            <p>No sales recorded yet.</p>
            <span>
              Your recorded sales will appear here.
            </span>
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
                </tr>
              </thead>

              <tbody>
                {sales.map((sale) => (
                  <tr key={sale._id}>
                    <td className="crop-name">
                      🌾 {sale.crop}
                    </td>

                    <td>{sale.buyer}</td>

                    <td>{sale.quantity} kg</td>

                    <td>₹{sale.pricePerKg}</td>

                    <td className="income-value">
                      ₹{sale.totalIncome}
                    </td>

                    <td>
                      {new Date(
                        sale.saleDate
                      ).toLocaleDateString()}
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