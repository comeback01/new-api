import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="public-page">
      <div className="public-card">
        <p className="eyebrow">new-api</p>
        <h1>Frontend refonte</h1>
        <p>Base propre posée pour la V2.</p>
        <div className="actions">
          <Link className="button primary" to="/login">Login</Link>
          <Link className="button" to="/app">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
