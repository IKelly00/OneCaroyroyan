import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/*
 * AppShell — Phase 3
 * ------------------------------------------------------------------
 * Real layout, replacing the Phase 2 placeholder. Structurally a 1:1
 * port of #app-shell > (#sidebar, #main-wrapper > (#topbar, #main-content)).
 *
 * Note the inline `display:flex`: global.css has `#app-shell{display:
 * none; ...}` because in the vanilla app this element existed in the
 * DOM from page load and JS flipped it visible on login. Here, this
 * component only ever mounts once ProtectedRoute has already
 * confirmed you're authenticated, so it should always render — the
 * inline style overrides that stale `display:none` from the ported
 * stylesheet rather than fighting it with a CSS rewrite.
 *
 * currentLabel: the vanilla app tracked "which page am I on" as a
 * side effect of goToPage() setting a DOM string. We derive the same
 * label declaratively from the URL instead — look up the current
 * route segment in navMenu (already scoped to this role).
 * ------------------------------------------------------------------
 */
export default function AppShell() {
  const { navMenu } = useAuth();
  const location = useLocation();

  const currentKey = location.pathname.split("/").filter(Boolean).pop();
  const currentLabel = navMenu.find((item) => item.k === currentKey)?.label ?? "Dashboard";

  return (
    <div id="app-shell" style={{ display: "flex", height: "100vh", flexDirection: "row" }}>
      <Sidebar />
      <div id="main-wrapper">
        <Topbar currentLabel={currentLabel} />
        <div id="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
