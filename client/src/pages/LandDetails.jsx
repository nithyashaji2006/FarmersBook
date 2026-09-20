import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LandDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        setLand(data);
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

  if (loading) {
    return <p>Loading land details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Land Details</h1>

      {land && (
        <div>
          <p>
            <strong>Location:</strong> {land.location}
          </p>

          <p>
            <strong>Area:</strong> {land.area}
          </p>

          <p>
            <strong>Plantation Year:</strong>{" "}
            {land.plantationYear}
          </p>

          <p>
            <strong>Soil Type:</strong> {land.soilType}
          </p>

          <button onClick={() => navigate("/lands")}>
            Back to Lands
          </button>
        </div>
      )}
    </div>
  );
}

export default LandDetails;