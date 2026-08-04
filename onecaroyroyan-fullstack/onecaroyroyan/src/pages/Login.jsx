import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*
 * Login
 * ------------------------------------------------------------------
 * Now backed by real authentication (POST /api/auth/login — see
 * backend/controllers/authController.js). Two behavior changes from
 * the mock version:
 *   1. The Role <select> is gone. Role is no longer something the
 *      user picks — it's looked up server-side from the `users` table
 *      and comes back embedded in the JWT/user object.
 *   2. Wrong credentials now actually fail, with an inline error
 *      message, instead of always succeeding.
 * ------------------------------------------------------------------
 */
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { doLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await doLogin(username, password);
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="login-screen">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <svg viewBox="0 0 24 24">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
            </svg>
          </div>
          <h1>OneCaroyroyan</h1>
          <p>
            Barangay E-Service &
            <br />
            Management Information System
          </p>
        </div>

        <form className="login-body" onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#B91C1C",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
                marginBottom: 4,
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="inp-user">Username</label>
            <input
              id="inp-user"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="inp-pass">Password</label>
            <input
              id="inp-pass"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button className="btn-login" type="submit" disabled={submitting}>
            {submitting ? "Signing In…" : "Sign In to System"}
          </button>

          <div className="login-note">
            <svg
              viewBox="0 0 24 24"
              style={{
                width: 12,
                height: 12,
                stroke: "#94a3b8",
                fill: "none",
                strokeWidth: 2,
              }}
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Authorized Personnel Only — Barangay Caroyroyan
          </div>
        </form>
      </div>
    </div>
  );
}
