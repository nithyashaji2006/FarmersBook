import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AddLand.css";

function AddLand() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [plantationYear, setPlantationYear] = useState("");
  const [soilType, setSoilType] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/lands",
        {
          method: "POST",
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
        setError(data.message || "Failed to add land");
        return;
      }

      setMessage("Land added successfully!");

      setLocation("");
      setArea("");
      setPlantationYear("");
      setSoilType("");

      setTimeout(() => {
        navigate("/lands");
      }, 1000);
    } catch (error) {
      setError("Unable to connect to server");
      console.error(error);
    }
  };

  return (
    <div className="add-land-page">
      <div className="add-land-card">

        <div className="add-land-header">
          <div className="add-land-icon">🌱</div>

          <h1>Add New Land</h1>

          <p>
            Add your farm land details to FarmersBook
          </p>
        </div>

        <form
          className="add-land-form"
          onSubmit={handleSubmit}
        >
          <div className="add-land-field">
            <label htmlFor="location">
              Location
            </label>

            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              placeholder="Enter land location"
              required
            />
          </div>

          <div className="add-land-field">
            <label htmlFor="area">
              Area
            </label>

            <input
              id="area"
              type="number"
              step="0.01"
              min="0"
              value={area}
              onChange={(e) =>
                setArea(e.target.value)
              }
              placeholder="Enter area in acres"
              required
            />
          </div>

          <div className="add-land-field">
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
              placeholder="Enter plantation year"
              required
            />
          </div>

          <div className="add-land-field">
            <label htmlFor="soilType">
              Soil Type
            </label>

            <input
              id="soilType"
              type="text"
              value={soilType}
              onChange={(e) =>
                setSoilType(e.target.value)
              }
              placeholder="Enter soil type"
              required
            />
          </div>

          {message && (
            <p className="add-land-message">
              {message}
            </p>
          )}

          {error && (
            <p className="add-land-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="add-land-button"
          >
            Add Land
          </button>
        </form>

      </div>
    </div>
  );
}

export default AddLand;