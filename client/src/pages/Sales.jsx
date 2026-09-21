import { useEffect, useState } from "react";

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
    <div>
      <h1>Sales</h1>

      {/* Record Sale */}
      <section>
        <h2>Record Crop Sale</h2>

        <form onSubmit={handleSubmit}>
          <div>
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

          <div>
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

          <div>
            <label>Quantity (kg)</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div>
            <label>Price per kg (₹)</label>
            <input
              type="number"
              name="pricePerKg"
              value={formData.pricePerKg}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div>
            <label>Sale Date</label>
            <input
              type="date"
              name="saleDate"
              value={formData.saleDate}
              onChange={handleChange}
              required
            />
          </div>

          <h3>Total Income: ₹{totalIncome}</h3>

          <button type="submit">
            Record Sale
          </button>
        </form>

        {message && <p>{message}</p>}
      </section>

      {/* Sales History */}
      <section>
        <h2>Sales History</h2>

        {sales.length === 0 ? (
          <p>No sales recorded yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Crop</th>
                <th>Buyer</th>
                <th>Quantity</th>
                <th>Price/kg</th>
                <th>Total Income</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id}>
                  <td>{sale.crop}</td>
                  <td>{sale.buyer}</td>
                  <td>{sale.quantity} kg</td>
                  <td>₹{sale.pricePerKg}</td>
                  <td>₹{sale.totalIncome}</td>
                  <td>
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Sales;