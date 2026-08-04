import { useAuth } from "../../context/AuthContext";
import DashboardAdmin from "./DashboardAdmin";
import DashboardSecretary from "./DashboardSecretary";
import DashboardAccounting from "./DashboardAccounting";
import DashboardTreasurer from "./DashboardTreasurer";
import DashboardCaptain from "./DashboardCaptain";

/*
 * Dashboard
 * ------------------------------------------------------------------
 * The single /app/dashboard route. Replaces the five separate
 * #page-dashboard-* divs the vanilla app kept in the DOM at once,
 * showing/hiding whichever matched the logged-in role.
 * ------------------------------------------------------------------
 */
export default function Dashboard() {
  const { currentRole } = useAuth();

  switch (currentRole) {
    case "Administrator":
      return <DashboardAdmin />;
    case "Barangay Secretary":
      return <DashboardSecretary />;
    case "Accounting Clerk":
      return <DashboardAccounting />;
    case "Treasurer":
      return <DashboardTreasurer />;
    case "Barangay Captain":
      return <DashboardCaptain />;
    default:
      return null;
  }
}
