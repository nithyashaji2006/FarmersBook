import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tag">🌱 SMART FARM MANAGEMENT</p>

          <h1>FarmersBook</h1>

          <h2>Everything Your Farm Needs, In One Place.</h2>

          <p className="hero-description">
            Manage your lands, track expenses, record harvests,
            monitor stock and keep track of your farm sales —
            simply and efficiently.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="home-button primary">
              Register
            </Link>

            <Link to="/login" className="home-button secondary">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🌾</div>
          <h3>Manage Lands</h3>
          <p>
            Keep all your farm land details organized in one place.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Track Expenses</h3>
          <p>
            Record and monitor your farming expenses easily.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📦</div>
          <h3>Monitor Stock</h3>
          <p>
            Keep track of harvest quantities and available stock.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Track Sales</h3>
          <p>
            Record your sales and understand your farm income.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;