import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <div>
      <h1>My Lands</h1>

      <Link to="/lands/add">
        <button>Add New Land</button>
      </Link>

      {error && <p>{error}</p>}

      {!error && lands.length === 0 && (
        <p>No lands added yet.</p>
      )}

      {lands.map((land) => (
        <div key={land._id}>
          <h3>{land.location}</h3>

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

         <Link to={`/lands/${land._id}`}>
  <button>View Details</button>
</Link>

<Link to={`/lands/edit/${land._id}`}>
  <button>Edit</button>
</Link>

<button onClick={() => handleDelete(land._id)}>
  Delete
</button>
        </div>
      ))}
    </div>
  );
}

export default Lands;