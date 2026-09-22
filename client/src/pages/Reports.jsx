import { useEffect, useState } from "react";
import "./Reports.css";

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
    return (
      <div className="reports-state">
        <div className="state-icon">⚠️</div>
        <h2>Unable to load reports</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!reports) {
    return (
      <div className="reports-state">
        <div className="state-icon">📊</div>
        <h2>Loading reports...</h2>
        <p>Please wait while we prepare your reports.</p>
      </div>
    );
  }

  return (
    <div className="reports-page">

      {/* Page Header */}
      <div className="reports-header">
        <p className="page-label">FINANCIAL OVERVIEW</p>

        <h1>Reports</h1>

        <p className="page-subtitle">
          Track your farm income, expenses and sales performance.
        </p>
      </div>

      {/* Financial Summary */}
      <section className="summary-section">
        <div className="section-heading">
          <div className="section-icon">📊</div>

          <div>
            <h2>Financial Summary</h2>
            <p>Your overall financial performance.</p>
          </div>
        </div>

        <div className="summary-grid">

          <div className="summary-card income-card">
            <div className="summary-icon">💰</div>

            <div>
              <span>Total Income</span>
              <strong>
                ₹{reports.totalIncome.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          <div className="summary-card expense-card">
            <div className="summary-icon">💸</div>

            <div>
              <span>Total Expenses</span>
              <strong>
                ₹{reports.totalExpenses.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          <div className="summary-card profit-card">
            <div className="summary-icon">📈</div>

            <div>
              <span>Profit / Loss</span>
              <strong>
                ₹{reports.profitLoss.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

        </div>
      </section>

      {/* Crop Sales Report */}
      <section className="report-card">
        <div className="section-heading">
          <div className="section-icon">🌾</div>

          <div>
            <h2>Crop Sales Report</h2>
            <p>Sales performance grouped by crop.</p>
          </div>
        </div>

        {reports.cropSales.length === 0 ? (
          <div className="empty-report">
            <div>📦</div>
            <p>No sales data available.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="report-table">
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
                    <td className="crop-name">
                      🌾 {crop.crop}
                    </td>

                    <td>{crop.quantity} kg</td>

                    <td className="income-value">
                      ₹{crop.income}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Sales Details */}
      <section className="report-card">
        <div className="section-heading">
          <div className="section-icon">🧾</div>

          <div>
            <h2>Sales Report</h2>
            <p>Detailed information about recorded sales.</p>
          </div>
        </div>

        {reports.sales.length === 0 ? (
          <div className="empty-report">
            <div>📦</div>
            <p>No sales recorded.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Crop</th>
                  <th>Buyer</th>
                  <th>Quantity</th>
                  <th>Price / kg</th>
                  <th>Total Income</th>
                </tr>
              </thead>

              <tbody>
                {reports.sales.map((sale) => (
                  <tr key={sale._id}>
                    <td>
                      {new Date(
                        sale.saleDate
                      ).toLocaleDateString()}
                    </td>

                    <td className="crop-name">
                      🌾 {sale.crop}
                    </td>

                    <td>{sale.buyer}</td>

                    <td>{sale.quantity} kg</td>

                    <td>₹{sale.pricePerKg}</td>

                    <td className="income-value">
                      ₹{sale.totalIncome}
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

export default Reports;