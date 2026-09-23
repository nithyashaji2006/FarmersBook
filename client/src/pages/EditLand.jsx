import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./EditLand.css";

function EditLand() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [plantationYear, setPlantationYear] = useState("");
  const [soilType, setSoilType] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch the existing land
  useEffect(() => {
    const fetchLand = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/lands/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch land");
          return;
        }

        setLocation(data.location);
        setArea(data.area);
        setPlantationYear(data.plantationYear);
        setSoilType(data.soilType);
      } catch (error) {
        setError("Unable to connect to server");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLand();
    }
  }, [id, token]);

  // Update the land
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/lands/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            location,
            area: Number(area),
            plantationYear: Number(plantationYear),
            soilType,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update land");
        return;
      }

      setMessage("Land updated successfully!");

      setTimeout(() => {
        navigate("/lands");
      }, 1000);
    } catch (error) {
      setError("Unable to connect to server");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="edit-land-page">
        <p className="edit-land-status">Loading land...</p>
      </div>
    );
  }

  if (error && !location) {
    return (
      <div className="edit-land-page">
        <div className="edit-land-card">
          <p className="edit-land-error">{error}</p>

          <button
            className="cancel-button"
            onClick={() => navigate("/lands")}
          >
            ← Back to Lands
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-land-page">
      <div className="edit-land-header">
        <p className="edit-land-label">FARM MANAGEMENT</p>
        <h1>Edit Land</h1>
      </div>

      <div className="edit-land-card">
        <div className="edit-land-title">
          <span>🌾</span>
          <h2>Update Land Information</h2>
        </div>

        <form className="edit-land-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="location">Location</label>

            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="area">Area</label>

            <input
              id="area"
              type="number"
              step="0.01"
              min="0"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="plantationYear">
              Plantation Year
            </label>

            <input
              id="plantationYear"
              type="number"
              value={plantationYear}
              onChange={(e) =>
                setPlantationYear(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="soilType">Soil Type</label>

            <input
              id="soilType"
              type="text"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              required
            />
          </div>

          {message && (
            <p className="edit-land-success">{message}</p>
          )}

          {error && <p className="edit-land-error">{error}</p>}

          <div className="edit-land-actions">
            <button type="submit" className="update-button">
              Update Land
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/lands")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditLand;