import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Icon from "../ui/Icon";

/*
 * Sidebar
 * ------------------------------------------------------------------
 * Replaces the DOM-building half of setupRole():
 *   const nav = document.getElementById("nav-menu");
 *   nav.innerHTML = "";
 *   ROLE_MENUS[role].forEach(item => {
 *     const btn = document.createElement("button");
 *     btn.className = "nav-item";
 *     btn.innerHTML = `${item.icon}<span>${item.label}</span>`;
 *     btn.onclick = () => goToPage(item.page, btn, item.label);
 *     nav.appendChild(btn);
 *   });
 *
 * `navMenu` already comes from AuthContext (derived from ROLE_MENUS
 * for currentRole), so this component just maps it to <NavLink>s.
 * NavLink's `isActive` replaces the manual "remove .active from every
 * button, add it back to the one that was clicked" dance — React
 * Router tracks that against the URL for us.
 * ------------------------------------------------------------------
 */
export default function Sidebar() {
  const { currentRole, navMenu, roleColor } = useAuth();

  return (
    <aside id="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: "#1D4ED8", fill: "none", strokeWidth: 2.5 }}>
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
          </svg>
        </div>
        <div>
          <div className="sidebar-logo-text">OneCaroyroyan</div>
          <div className="sidebar-logo-sub">E-Service MIS</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-label">Navigation</div>
        {navMenu.map((item) => (
          <NavLink
            key={item.k}
            to={`/app/${item.k}`}
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
          >
            <Icon svg={item.icon} size={15} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="role-badge" style={{ background: roleColor }}>
          <div className="role-name">{currentRole}</div>
          <div className="role-brgy">Bgy. Caroyroyan</div>
        </div>
      </div>
    </aside>
  );
}
