import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/dashboard");
      const data = await response.json();

      if (response.ok) {
        setDashboard(data);
      } else {
        setError(data.message || "Failed to load dashboard");
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      setError("Unable to connect to server");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-message error-message">{error}</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-message">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <span className="hero-small-title">Welcome back! 🌱</span>

          <h1>Your Farm at a Glance</h1>

          <p>Track your income, expenses and growth — all in one place.</p>
        </div>

        <div className="hero-decoration">🌿</div>
      </section>

      {/* Summary Cards */}
      <section className="summary-grid">
        {/* Income */}
        <div className="summary-card income-card">
          <div className="summary-icon">🌱</div>

          <div className="summary-info">
            <span>Total Income</span>

            <h2>₹{dashboard.totalIncome.toLocaleString("en-IN")}</h2>

            <p>Total sales income</p>
          </div>
        </div>

        {/* Expenses */}
        <div className="summary-card expense-card">
          <div className="summary-icon">💰</div>

          <div className="summary-info">
            <span>Total Expenses</span>

            <h2>₹{dashboard.totalExpenses.toLocaleString("en-IN")}</h2>

            <p>Farm expenses</p>
          </div>
        </div>

        {/* Profit */}
        <div className="summary-card profit-card">
          <div className="summary-icon">📈</div>

          <div className="summary-info">
            <span>Profit / Loss</span>

            <h2>₹{dashboard.profitLoss.toLocaleString("en-IN")}</h2>

            <p>Current financial result</p>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        {/* Recent Sales */}
        <section className="sales-section">
          <div className="section-header">
            <div className="section-title">
              <div className="section-icon">🌿</div>

              <div>
                <h2>Recent Sales</h2>

                <p>Your latest crop sales</p>
              </div>
            </div>

            <Link to="/sales" className="view-sales-btn">
              View All Sales →
            </Link>
          </div>

          <div className="table-wrapper">
            {dashboard.recentSales.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🌾</div>

                <h3>No recent sales</h3>

                <p>Your recent crop sales will appear here.</p>

                <Link to="/sales" className="add-sale-btn">
                  + Add New Sale
                </Link>
              </div>
            ) : (
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Crop</th>
                    <th>Buyer</th>
                    <th>Quantity</th>
                    <th>Total Income</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.recentSales.map((sale) => (
                    <tr key={sale._id}>
                      <td>
                        <div className="crop-cell">
                          <span className="crop-icon">🌱</span>

                          <strong>{sale.crop}</strong>
                        </div>
                      </td>

                      <td>{sale.buyer}</td>

                      <td>{sale.quantity} kg</td>

                      <td>
                        <strong className="income-value">
                          ₹{sale.totalIncome.toLocaleString("en-IN")}
                        </strong>
                      </td>

                      <td>
                        {new Date(sale.saleDate).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <aside className="quick-panel">
          <div className="quick-header">
            <div className="quick-leaf">🌿</div>

            <div>
              <h2>Keep Growing!</h2>
              <p>Small steps today, a greener tomorrow.</p>
            </div>
          </div>

          <Link to="/sales" className="quick-sale-btn">
            + &nbsp; Add New Sale
          </Link>

          <div className="quick-links">
            <h3>Quick Links</h3>

            <Link to="/lands">
              <span>🌾</span>
              Manage Lands
              <strong>›</strong>
            </Link>

            <Link to="/reports">
              <span>📊</span>
              View Reports
              <strong>›</strong>
            </Link>

            <Link to="/profile">
              <span>👤</span>
              Update Profile
              <strong>›</strong>
            </Link>
          </div>
        </aside>
      </div>

      {/* Bottom Quote */}
      <div className="dashboard-footer">
        <span>Good Farms, Better Futures 🌱</span>
        <span>FarmersBook · Cultivating Growth Together</span>
      </div>
    </div>
  );
}

export default Dashboard;