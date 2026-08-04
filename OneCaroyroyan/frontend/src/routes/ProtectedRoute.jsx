import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*
 * ProtectedRoute
 * ------------------------------------------------------------------
 * Gate for every /app/* route. `initializing` covers the brief window
 * on page load/refresh where AuthContext is verifying a stored JWT
 * against GET /api/auth/me — without it, a refresh would flash the
 * user back to /login before the token check resolves.
 * ------------------------------------------------------------------
 */
export default function ProtectedRoute() {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#64748b" }}>
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
