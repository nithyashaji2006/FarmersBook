import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Lands.css";

function Lands() {
  const { token } = useAuth();

  const [lands, setLands] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/lands", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch lands");
          return;
        }

        setLands(data);
      } catch (error) {
        setError("Unable to connect to server");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLands();
    }
  }, [token]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this land?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/lands/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete land");
        return;
      }

      setLands((previousLands) =>
        previousLands.filter((land) => land._id !== id)
      );
    } catch (error) {
      setError("Unable to connect to server");
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading lands...</p>;
  }

  return (
    <div className="lands-page">
      <div className="lands-header">
        <div>
          <p className="page-label">FARM MANAGEMENT</p>
          <h1>My Lands</h1>
        </div>

        <Link to="/lands/add">
          <button className="add-land-button">
            + Add New Land
          </button>
        </Link>
      </div>

      {error && <p>{error}</p>}

      {!error && lands.length === 0 && (
        <div className="empty-message">
          <p>No lands added yet.</p>
          <p>Add your first land to get started.</p>
        </div>
      )}

      <div className="lands-grid">
        {lands.map((land) => (
          <div className="land-card" key={land._id}>
            <h3>🌾 {land.location}</h3>

            <p className="land-info">
              <strong>Area:</strong> {land.area}
            </p>

            <p className="land-info">
              <strong>Plantation Year:</strong>{" "}
              {land.plantationYear}
            </p>

            <p className="land-info">
              <strong>Soil Type:</strong> {land.soilType}
            </p>

            <div className="land-actions">
              <Link to={`/lands/edit/${land._id}`}>
                <button className="edit-button">
                  Edit
                </button>
              </Link>

              <button
                className="delete-button"
                onClick={() => handleDelete(land._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lands;