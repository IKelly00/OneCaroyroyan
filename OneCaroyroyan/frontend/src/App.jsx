import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import ModalRoot from "./components/layout/ModalRoot";

import Login from "./pages/Login";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./pages/dashboards/Dashboard";
import Residents from "./pages/Residents";
import Certificates from "./pages/Certificates";
import Correspondence from "./pages/Correspondence";
import Complaints from "./pages/Complaints";
import Payments from "./pages/Payments";
import FinReports from "./pages/FinReports";
import CaptainReports from "./pages/CaptainReports";
import Settings from "./pages/Settings";

/*
 * App
 * ------------------------------------------------------------------
 * Replaces the vanilla app's doLogin()/doLogout() DOM-toggling with
 * real client-side routing. Route map, and how it corresponds to the
 * original `page` ids used by ROLE_MENUS / goToPage():
 *
 *   /login                    #login-screen
 *   /app                      #app-shell (ProtectedRoute-guarded)
 *     /app/dashboard          #page-dashboard-{admin,secretary,...}
 *     /app/residents          #page-residents
 *     /app/certificates       #page-certificates
 *     /app/correspondence     #page-correspondence
 *     /app/complaints         #page-complaints
 *     /app/payments           #page-payments
 *     /app/finreports         #page-fin-reports
 *     /app/captainreports     #page-captain-reports
 *     /app/settings           #page-settings
 *
 * Note the five dashboard-* page ids all collapse into the single
 * /app/dashboard route — see Dashboard.jsx for why.
 *
 * <AuthProvider> wraps <BrowserRouter> (order doesn't actually matter
 * between these two, but it reads naturally as "auth state, THEN
 * routing that depends on it") so that both ProtectedRoute and every
 * page/component below can call useAuth().
 * ------------------------------------------------------------------
 */
export default function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<AppShell />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="residents" element={<Residents />} />
                <Route path="certificates" element={<Certificates />} />
                <Route path="correspondence" element={<Correspondence />} />
                <Route path="complaints" element={<Complaints />} />
                <Route path="payments" element={<Payments />} />
                <Route path="finreports" element={<FinReports />} />
                <Route path="captainreports" element={<CaptainReports />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
        <ModalRoot />
      </ModalProvider>
    </AuthProvider>
  );
}
