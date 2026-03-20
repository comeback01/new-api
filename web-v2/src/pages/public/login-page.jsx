import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/use-auth";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await login({ username, password });
      navigate("/app");
    } catch (err) {
      setError(err?.message || "Login failed");
    }
  }

  return (
    <div className="public-page">
      <div className="public-card auth-card">
        <p className="eyebrow">auth</p>
        <h1>Login</h1>
        <p>Connexion minimale branchée au backend existant.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Username</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="openclaw" />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </label>
          {error ? <div className="error-box">{error}</div> : null}
          <button className="button primary" type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
