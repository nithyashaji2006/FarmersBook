import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
      const response = await fetch("http://localhost:5000/api/lands", {
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
      });

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
    <div>
      <h1>Add Land</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter land location"
            required
          />
        </div>

        <div>
          <label>Area</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Enter area"
            required
          />
        </div>

        <div>
          <label>Plantation Year</label>
          <input
            type="number"
            value={plantationYear}
            onChange={(e) => setPlantationYear(e.target.value)}
            placeholder="Enter plantation year"
            required
          />
        </div>

        <div>
          <label>Soil Type</label>
          <input
            type="text"
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
            placeholder="Enter soil type"
            required
          />
        </div>

        <button type="submit">Add Land</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default AddLand;