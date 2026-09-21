import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-heading">
        <p className="profile-label">MY ACCOUNT</p>
        <h1>Profile</h1>
      </div>

      {user ? (
        <div className="profile-card">
          <div className="profile-main">
            <div className="profile-avatar">👤</div>

            <h2>{user.name}</h2>

            <p className="profile-email">
              {user.email}
            </p>
          </div>

          <div className="profile-details">
            <div className="profile-detail">
              <div className="profile-detail-icon">👤</div>

              <div className="profile-detail-text">
                <span className="profile-detail-label">
                  Name
                </span>

                <span className="profile-detail-value">
                  {user.name}
                </span>
              </div>
            </div>

            <div className="profile-detail">
              <div className="profile-detail-icon">✉️</div>

              <div className="profile-detail-text">
                <span className="profile-detail-label">
                  Email
                </span>

                <span className="profile-detail-value">
                  {user.email}
                </span>
              </div>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
}

export default Profile;