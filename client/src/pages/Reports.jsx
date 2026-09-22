import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Reports.css";

function Reports() {
  const { token } = useAuth();

  const [reports, setReports] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      const [reportsResponse, expensesResponse, cropsResponse] =
        await Promise.all([
          fetch("http://localhost:5000/api/reports", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch("http://localhost:5000/api/expenses", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch("http://localhost:5000/api/crops", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const reportsData = await reportsResponse.json();
      const expensesData = await expensesResponse.json();
      const cropsData = await cropsResponse.json();

      if (!reportsResponse.ok) {
        setError(reportsData.message || "Failed to load reports");
        return;
      }

      if (!expensesResponse.ok) {
        setError(expensesData.message || "Failed to load expenses");
        return;
      }

      if (!cropsResponse.ok) {
        setError(cropsData.message || "Failed to load crops");
        return;
      }

      setReports(reportsData);
      setExpenses(expensesData);
      setCrops(cropsData);
    } catch (error) {
      console.error("Reports error:", error);

      setError("Unable to connect to server");
    }
  };

  useEffect(() => {
    if (token) {
      fetchReports();
    }
  }, [token]);

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

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0,
  );

  // Calculate profit/loss
  const profitLoss = reports.totalIncome - totalExpenses;

  // Group expenses by category
  const expenseCategories = {};

  expenses.forEach((expense) => {
    if (!expenseCategories[expense.category]) {
      expenseCategories[expense.category] = {
        category: expense.category,
        amount: 0,
      };
    }

    expenseCategories[expense.category].amount += Number(expense.amount || 0);
  });

  const expenseBreakdown = Object.values(expenseCategories);

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

              <strong>₹{reports.totalIncome.toLocaleString("en-IN")}</strong>
            </div>
          </div>

          <div className="summary-card expense-card">
            <div className="summary-icon">💸</div>

            <div>
              <span>Total Expenses</span>

              <strong>₹{totalExpenses.toLocaleString("en-IN")}</strong>
            </div>
          </div>

          <div className="summary-card profit-card">
            <div className="summary-icon">📈</div>

            <div>
              <span>Profit / Loss</span>

              <strong>₹{profitLoss.toLocaleString("en-IN")}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Crop Stock Report */}
      <section className="report-card">
        <div className="section-heading">
          <div className="section-icon">🌱</div>

          <div>
            <h2>Crop Stock Report</h2>

            <p>Current available stock of your crops.</p>
          </div>
        </div>

        {crops.length === 0 ? (
          <div className="empty-report">
            <div>🌱</div>

            <p>No crops recorded.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Available Stock</th>
                </tr>
              </thead>

              <tbody>
                {crops.map((crop) => (
                  <tr key={crop._id}>
                    <td className="crop-name">🌾 {crop.cropName}</td>

                    <td>{crop.availableStock} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Expense Breakdown */}
      <section className="report-card">
        <div className="section-heading">
          <div className="section-icon">💸</div>

          <div>
            <h2>Expense Breakdown</h2>

            <p>Expenses grouped by category.</p>
          </div>
        </div>

        {expenseBreakdown.length === 0 ? (
          <div className="empty-report">
            <div>💰</div>

            <p>No expenses recorded.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Total Expense</th>
                </tr>
              </thead>

              <tbody>
                {expenseBreakdown.map((expense) => (
                  <tr key={expense.category}>
                    <td>{expense.category}</td>

                    <td>₹{expense.amount.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
                    <td className="crop-name">🌾 {crop.crop}</td>

                    <td>{crop.quantity} kg</td>

                    <td className="income-value">₹{crop.income}</td>
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
                      {new Date(sale.saleDate).toLocaleDateString("en-IN")}
                    </td>

                    <td className="crop-name">🌾 {sale.crop}</td>

                    <td>{sale.buyer}</td>

                    <td>{sale.quantity} kg</td>

                    <td>₹{sale.pricePerKg}</td>

                    <td className="income-value">₹{sale.totalIncome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Expense Details */}
      <section className="report-card">
        <div className="section-heading">
          <div className="section-icon">🧾</div>

          <div>
            <h2>Expense Report</h2>

            <p>Detailed information about recorded expenses.</p>
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="empty-report">
            <div>💰</div>

            <p>No expenses recorded.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>
                      {new Date(expense.date).toLocaleDateString("en-IN")}
                    </td>

                    <td>{expense.category}</td>

                    <td>₹{Number(expense.amount).toLocaleString("en-IN")}</td>
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
