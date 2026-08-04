import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/*
 * Topbar
 * ------------------------------------------------------------------
 * 1:1 port of #topbar. `currentLabel` is passed down from AppShell,
 * which derives it from the matched route + navMenu (see AppShell.jsx)
 * — replacing the original's:
 *   document.getElementById("topbar-page").textContent = label;
 * which goToPage() set manually on every navigation.
 * ------------------------------------------------------------------
 */
export default function Topbar({ currentLabel }) {
  const { currentRole, roleColor, roleInitials, doLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    doLogout();
    navigate("/login", { replace: true });
  };

  return (
    <div id="topbar">
      <div className="topbar-left">
        <span>OneCaroyroyan</span>
        <svg viewBox="0 0 24 24" style={{ width: 11, height: 11, stroke: "#CBD5E1", fill: "none", strokeWidth: 2.5 }}>
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span className="current">{currentLabel}</span>
      </div>

      <div className="topbar-right">
        <button className="topbar-bell" type="button">
          <svg viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="bell-dot" />
        </button>

        <div className="divider-v" />

        <div className="user-chip">
          <div className="user-avatar" style={{ background: roleColor }}>
            {roleInitials}
          </div>
          <div>
            <div className="user-name">{currentRole}</div>
            <div className="user-role-sub">Barangay Caroyroyan</div>
          </div>
        </div>

        <button className="btn-logout" type="button" onClick={handleLogout}>
          <svg viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}
