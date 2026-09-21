import { useEffect, useState } from "react";

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
    return <p>{error}</p>;
  }

  if (!dashboard) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <div>
        <h2>Total Income</h2>
        <p>₹{dashboard.totalIncome}</p>
      </div>

      <div>
        <h2>Total Expenses</h2>
        <p>₹{dashboard.totalExpenses}</p>
      </div>

      <div>
        <h2>Profit / Loss</h2>
        <p>₹{dashboard.profitLoss}</p>
      </div>

      <div>
        <h2>Recent Sales</h2>

        {dashboard.recentSales.length === 0 ? (
          <p>No recent sales.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Crop</th>
                <th>Buyer</th>
                <th>Quantity</th>
                <th>Total Income</th>
              </tr>
            </thead>

            <tbody>
              {dashboard.recentSales.map((sale) => (
                <tr key={sale._id}>
                  <td>{sale.crop}</td>
                  <td>{sale.buyer}</td>
                  <td>{sale.quantity} kg</td>
                  <td>₹{sale.totalIncome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;