import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Crops.css";

function Crops() {
  const { token } = useAuth();

  // Data states
  const [crops, setCrops] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState("");
  const [actionFeedback, setActionFeedback] = useState("");

  // Add Crop Form state
  const [newCropName, setNewCropName] = useState("");
  const [addCropLoading, setAddCropLoading] = useState(false);
  const [addCropSuccess, setAddCropSuccess] = useState("");
  const [addCropError, setAddCropError] = useState("");

  // Record Harvest Form state
  const [selectedCropId, setSelectedCropId] = useState("");
  const [harvestQuantity, setHarvestQuantity] = useState("");
  const [harvestDate, setHarvestDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [harvestLoading, setHarvestLoading] = useState(false);
  const [harvestSuccess, setHarvestSuccess] = useState("");
  const [harvestError, setHarvestError] = useState("");

  // Edit Crop state
  const [editingCropId, setEditingCropId] = useState(null);
  const [editCropName, setEditCropName] = useState("");
  const [editAvailableStock, setEditAvailableStock] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Fetch Crops & Harvests from API
  const fetchData = async () => {
    try {
      setGlobalError("");

      const [cropsRes, harvestsRes] = await Promise.all([
        fetch("http://localhost:5000/api/crops", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/harvests", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const cropsData = await cropsRes.json();
      const harvestsData = await harvestsRes.json();

      if (!cropsRes.ok) {
        setGlobalError(cropsData.message || "Failed to fetch crops");
      } else {
        setCrops(cropsData);
      }

      if (harvestsRes.ok) {
        setHarvests(harvestsData);
      }
    } catch (err) {
      console.error("FETCH CROPS ERROR:", err);
      setGlobalError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  // Handle Add Crop Submit
  const handleAddCrop = async (e) => {
    e.preventDefault();
    setAddCropError("");
    setAddCropSuccess("");

    if (!newCropName.trim()) {
      setAddCropError("Please enter a crop name");
      return;
    }

    setAddCropLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/crops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cropName: newCropName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAddCropError(data.message || "Failed to add crop");
        return;
      }

      setAddCropSuccess(`Crop "${data.crop.cropName}" added successfully!`);
      setNewCropName("");
      await fetchData();
    } catch (err) {
      console.error("ADD CROP ERROR:", err);
      setAddCropError(err.message || "Unable to connect to the server");
    } finally {
      setAddCropLoading(false);
    }
  };

  // Handle Record Harvest Submit
  const handleRecordHarvest = async (e) => {
    e.preventDefault();
    setHarvestError("");
    setHarvestSuccess("");

    if (!selectedCropId) {
      setHarvestError("Please select a crop");
      return;
    }

    if (!harvestQuantity || Number(harvestQuantity) <= 0) {
      setHarvestError("Quantity must be greater than 0");
      return;
    }

    if (!harvestDate) {
      setHarvestError("Please select a valid harvest date");
      return;
    }

    setHarvestLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/harvests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cropId: selectedCropId,
          quantity: Number(harvestQuantity),
          harvestDate: harvestDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setHarvestError(data.message || "Failed to record harvest");
        return;
      }

      setHarvestSuccess(
        `Recorded harvest of ${harvestQuantity} kg! Crop stock updated.`
      );
      setHarvestQuantity("");
      setSelectedCropId("");
      await fetchData();
    } catch (err) {
      console.error("RECORD HARVEST ERROR:", err);
      setHarvestError(err.message || "Unable to connect to the server");
    } finally {
      setHarvestLoading(false);
    }
  };

  // Start Editing Crop
  const handleStartEdit = (crop) => {
    setEditingCropId(crop._id);
    setEditCropName(crop.cropName);
    setEditAvailableStock(crop.availableStock);
    setActionFeedback("");
  };

  // Cancel Editing Crop
  const handleCancelEdit = () => {
    setEditingCropId(null);
    setEditCropName("");
    setEditAvailableStock("");
  };

  // Save Edited Crop
  const handleSaveEdit = async (cropId) => {
    if (!editCropName.trim()) {
      alert("Crop name cannot be empty");
      return;
    }

    const stockNum = Number(editAvailableStock);
    if (isNaN(stockNum) || stockNum < 0) {
      alert("Stock quantity cannot be negative");
      return;
    }

    setEditLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/crops/${cropId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cropName: editCropName.trim(),
          availableStock: stockNum,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update crop");
        return;
      }

      setActionFeedback(`Updated "${data.crop.cropName}" successfully!`);
      setEditingCropId(null);
      await fetchData();
    } catch (err) {
      console.error("UPDATE CROP ERROR:", err);
      alert("Failed to connect to server");
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Crop
  const handleDeleteCrop = async (cropId, cropName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete crop "${cropName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/crops/${cropId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete crop");
        return;
      }

      setActionFeedback(`Crop "${cropName}" was deleted.`);
      await fetchData();
    } catch (err) {
      console.error("DELETE CROP ERROR:", err);
      alert("Failed to connect to server");
    }
  };

  // Delete Harvest Record
  const handleDeleteHarvest = async (harvestId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this harvest record? Stock will be adjusted accordingly."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/harvests/${harvestId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete harvest record");
        return;
      }

      setActionFeedback("Harvest record deleted and stock updated.");
      await fetchData();
    } catch (err) {
      console.error("DELETE HARVEST ERROR:", err);
      alert("Failed to connect to server");
    }
  };

  if (loading) {
    return (
      <div className="crops-page">
        <div className="loading-container">
          <p>Loading Crop Stock & Harvest data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crops-page">
      <div className="crops-header">
        <h1>Crop Stock & Harvest Management</h1>
        <p>Maintain your available crop inventory, update mistakes, and record harvests</p>
      </div>

      {globalError && <div className="error-message">{globalError}</div>}
      {actionFeedback && <div className="success-message">{actionFeedback}</div>}

      {/* Forms Section */}
      <div className="crops-grid-forms">
        {/* ADD CROP FORM */}
        <div className="crop-card">
          <h2>🌱 Add New Crop</h2>
          <form onSubmit={handleAddCrop} className="form-single-col">
            <div className="form-group">
              <label htmlFor="cropNameInput">Crop Name</label>
              <input
                id="cropNameInput"
                type="text"
                placeholder="e.g. Wheat, Rice, Corn"
                value={newCropName}
                onChange={(e) => setNewCropName(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={addCropLoading}
            >
              {addCropLoading ? "Adding..." : "Add Crop"}
            </button>
          </form>
          {addCropSuccess && (
            <p className="success-message">{addCropSuccess}</p>
          )}
          {addCropError && <p className="error-message">{addCropError}</p>}
        </div>

        {/* RECORD HARVEST FORM */}
        <div className="harvest-card">
          <h2>🌾 Record Harvest</h2>
          <form onSubmit={handleRecordHarvest} className="form-single-col">
            <div className="form-group">
              <label htmlFor="harvestCropSelect">Select Crop</label>
              <select
                id="harvestCropSelect"
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
                required
              >
                <option value="">-- Choose a Crop --</option>
                {crops.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.cropName} (Current Stock: {c.availableStock} kg)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="harvestQuantityInput">Quantity (kg)</label>
              <input
                id="harvestQuantityInput"
                type="number"
                step="any"
                min="0.01"
                placeholder="Enter harvest quantity in kg"
                value={harvestQuantity}
                onChange={(e) => setHarvestQuantity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="harvestDateInput">Harvest Date</label>
              <input
  id="harvestDateInput"
  type="date"
  value={harvestDate}
  max={new Date().toISOString().split("T")[0]}
  onChange={(e) => setHarvestDate(e.target.value)}
  required
/>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={harvestLoading}
            >
              {harvestLoading ? "Recording..." : "Record Harvest"}
            </button>
          </form>
          {harvestSuccess && (
            <p className="success-message">{harvestSuccess}</p>
          )}
          {harvestError && <p className="error-message">{harvestError}</p>}
        </div>
      </div>

      {/* CURRENT CROP STOCK DISPLAY */}
      <div className="stock-summary-card">
        <h2>📦 Current Crop Stock</h2>
        {crops.length === 0 ? (
          <p className="empty-message">
            No crops registered yet. Add a crop above to get started.
          </p>
        ) : (
          <div className="stock-cards-grid">
            {crops.map((c) => {
              const isEditing = editingCropId === c._id;

              return (
                <div key={c._id} className="stock-item-card">
                  {isEditing ? (
                    <div className="edit-crop-form">
                      <div className="form-group" style={{ marginBottom: "8px" }}>
                        <label style={{ fontSize: "12px" }}>Crop Name</label>
                        <input
                          type="text"
                          value={editCropName}
                          onChange={(e) => setEditCropName(e.target.value)}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: "12px" }}>
                        <label style={{ fontSize: "12px" }}>Stock (kg)</label>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={editAvailableStock}
                          onChange={(e) => setEditAvailableStock(e.target.value)}
                        />
                      </div>
                      <div className="action-buttons-row">
                        <button
                          className="btn-save"
                          onClick={() => handleSaveEdit(c._id)}
                          disabled={editLoading}
                        >
                          {editLoading ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={handleCancelEdit}
                          disabled={editLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="crop-name">{c.cropName}</div>
                      <div className="stock-amount">
                        {Number(c.availableStock).toLocaleString()}{" "}
                        <span className="stock-unit">kg available</span>
                      </div>
                      <div className="action-buttons-row" style={{ marginTop: "12px" }}>
                        <button
                          className="btn-edit"
                          onClick={() => handleStartEdit(c)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteCrop(c._id, c.cropName)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* HARVEST HISTORY TABLE */}
      <div className="harvest-history-card">
        <h2>📋 Harvest Records</h2>
        {harvests.length === 0 ? (
          <p className="empty-message">No harvest records recorded yet.</p>
        ) : (
          <div className="table-container">
            <table className="crops-table">
              <thead>
                <tr>
                  <th>Crop Name</th>
                  <th>Quantity (kg)</th>
                  <th>Harvest Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {harvests.map((h) => (
                  <tr key={h._id}>
                    <td>
                      {h.cropId ? h.cropId.cropName : "Unknown / Deleted Crop"}
                    </td>
                    <td>{Number(h.quantity).toLocaleString()} kg</td>
                    <td>
                      {new Date(h.harvestDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td>
                      <button
                        className="btn-delete-sm"
                        onClick={() => handleDeleteHarvest(h._id)}
                      >
                        🗑️ Remove
                      </button>
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

export default Crops;
