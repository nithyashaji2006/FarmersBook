import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Expenses.css";

function Expenses() {
  const { token } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/expenses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to fetch expenses");
        return;
      }

      setExpenses(data);
    } catch (error) {
      console.error("FETCH EXPENSES ERROR:", error);
      setError("Unable to connect to the server");
    }
  };

  useEffect(() => {
    if (token) {
      fetchExpenses();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/expenses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category,
            amount: Number(amount),
            date: date || new Date().toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Failed to create expense");
        return;
      }

      setCategory("");
      setAmount("");
      setDate("");

      setSuccess("Expense added successfully!");

      await fetchExpenses();
    } catch (error) {
      console.error("ADD EXPENSE ERROR:", error);
      setError(error.message || "Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <h1>Expense Management</h1>
        <p>Track and manage your farming expenses</p>
      </div>

      <div className="expense-form-card">
        <h2>Add New Expense</h2>

        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-group">
            <label>Expense Category</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select category</option>
              <option value="Labour">Labour</option>
              <option value="Fertilizer">Fertilizer</option>
              <option value="Pesticide">Pesticide</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount (₹)</label>

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </form>

        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="total-card">
        <h2>Total Expenses</h2>
        <p>₹{totalExpenses.toLocaleString("en-IN")}</p>
      </div>

      <div className="expense-list-card">
        <h2>Your Expenses</h2>

        {expenses.length === 0 ? (
          <p className="empty-message">No expenses found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{expense.category}</td>
                    <td>
                      ₹{Number(expense.amount).toLocaleString("en-IN")}
                    </td>
                    <td>
                      {new Date(expense.date).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Expenses;