import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">FarmersBook</Link>
      </div>

  <div className="navbar-links">
  <Link to="/dashboard">Dashboard</Link>
  <Link to="/lands">Lands</Link>
  <Link to="/expenses">Expenses</Link>
  <Link to="/profile">Profile</Link>
</div>
    </nav>
  );
}

export default Navbar;