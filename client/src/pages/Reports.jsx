import { useEffect, useState } from "react";

function Reports() {
  const [reports, setReports] = useState(null);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/reports");
      const data = await response.json();

      if (response.ok) {
        setReports(data);
      } else {
        setError(data.message || "Failed to load reports");
      }
    } catch (error) {
      console.error("Reports error:", error);
      setError("Unable to connect to server");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!reports) {
    return <p>Loading reports...</p>;
  }

  return (
    <div>
      <h1>Reports</h1>

      {/* Financial Summary */}
      <section>
        <h2>Financial Summary</h2>

        <p>
          <strong>Total Income:</strong> ₹{reports.totalIncome}
        </p>

        <p>
          <strong>Total Expenses:</strong> ₹{reports.totalExpenses}
        </p>

        <p>
          <strong>Profit / Loss:</strong> ₹{reports.profitLoss}
        </p>
      </section>

      {/* Crop-wise Sales */}
      <section>
        <h2>Crop Sales Report</h2>

        {reports.cropSales.length === 0 ? (
          <p>No sales data available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Crop</th>
                <th>Total Quantity</th>
                <th>Total Income</th>
              </tr>
            </thead>

            <tbody>
              {reports.cropSales.map((crop) => (
                <tr key={crop.crop}>
                  <td>{crop.crop}</td>
                  <td>{crop.quantity} kg</td>
                  <td>₹{crop.income}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Sales Details */}
      <section>
        <h2>Sales Report</h2>

        {reports.sales.length === 0 ? (
          <p>No sales recorded.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Crop</th>
                <th>Buyer</th>
                <th>Quantity</th>
                <th>Price/kg</th>
                <th>Total Income</th>
              </tr>
            </thead>

            <tbody>
              {reports.sales.map((sale) => (
                <tr key={sale._id}>
                  <td>
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </td>
                  <td>{sale.crop}</td>
                  <td>{sale.buyer}</td>
                  <td>{sale.quantity} kg</td>
                  <td>₹{sale.pricePerKg}</td>
                  <td>₹{sale.totalIncome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Reports;