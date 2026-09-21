import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { token } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🌱 FarmersBook</Link>
      </div>

      <div className="navbar-links">
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/lands">Lands</Link>
            <Link to="/expenses">Expenses</Link>
            <Link to="/sales">Sales</Link>
            <Link to="/reports">Reports</Link>
            <Link to="/profile">Profile</Link>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="navbar-register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;