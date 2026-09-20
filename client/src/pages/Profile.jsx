import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Profile</h1>

      {user ? (
        <div>
          <p>
            <strong>Name:</strong> {user.name}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
}

export default Profile;