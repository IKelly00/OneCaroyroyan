import { useEffect, useState } from "react";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import StatusTag from "../../components/ui/StatusTag";
import { useModal } from "../../context/ModalContext";
import { dashboardApi } from "../../lib/api";

const ICONS_ = {
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>',
  print: '<polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
};

/*
 * DashboardSecretary — live version, backed by GET /api/dashboard/secretary
 * (real correspondence + complaints counts and recent rows from MySQL).
 */
export default function DashboardSecretary() {
  const { openModal } = useModal();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    dashboardApi.secretary().then(setStats).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  return (
    <div>
      <div className="page-header">
        <div><h1>Barangay Secretary Dashboard</h1><p>Correspondence & Complaints Management</p></div>
      </div>

      {error && <div style={{ color: "#B91C1C", marginBottom: 12 }}>{error}</div>}

      <div className="cards cols-3">
        <StatCard icon={ICONS_.mail} color="bg-blue" label="Correspondence Logged" value={loading ? "…" : stats.correspondenceTotal} sub={loading ? "" : `${stats.correspondenceForAction} need action`} />
        <StatCard icon={ICONS_.alert} color="bg-amber" label="Open Blotter Cases" value={loading ? "…" : stats.blotterOpenCases} sub="Pending / under mediation" />
        <StatCard icon={ICONS_.clock} color="bg-rose" label="Resolved Cases" value={loading ? "…" : stats.blotterResolved} sub="Total resolved" />
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <div><div className="panel-title">Recent Correspondence</div><div className="panel-sub">LGU, national & external offices</div></div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-print" onClick={() => openModal("print", { type: "correspondence-log" })}>
                <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICONS_.print }} />Print Log
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => openModal("logLetter", { onSaved: load })}>
                <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICONS_.plus }} />Log Letter
              </button>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Track No.</th><th>Sender</th><th>Status</th><th>Digitized</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ textAlign: "center", color: "#94a3b8" }}>Loading…</td></tr>
                ) : stats.recentCorrespondence.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: "center", color: "#94a3b8" }}>No correspondence logged yet</td></tr>
                ) : (
                  stats.recentCorrespondence.map((c) => (
                    <tr key={c.id}>
                      <td><span className="mono">{c.track_no}</span></td>
                      <td><strong>{c.sender}</strong></td>
                      <td><Badge status={c.status} /></td>
                      <td><StatusTag done={!!c.digitized} doneLabel="Done" pendingLabel="Pending" /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div><div className="panel-title">Blotter Cases</div><div className="panel-sub">Complaint monitoring</div></div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-print" onClick={() => openModal("print", { type: "blotter-report" })}>
                <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICONS_.print }} />Print Blotter
              </button>
              <button className="btn btn-amber btn-sm" onClick={() => openModal("newBlotter", { onSaved: load })}>
                <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICONS_.plus }} />New Blotter
              </button>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Blotter No.</th><th>Complainant</th><th>Nature</th><th>Kagawad</th><th>Status</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "#94a3b8" }}>Loading…</td></tr>
                ) : stats.recentComplaints.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "#94a3b8" }}>No blotter cases filed yet</td></tr>
                ) : (
                  stats.recentComplaints.map((c) => (
                    <tr key={c.id}>
                      <td><span className="mono">{c.case_no}</span></td>
                      <td><strong>{c.complainant}</strong></td>
                      <td style={{ fontSize: 11 }}>{c.nature}</td>
                      <td style={{ fontSize: 11, color: "#1D4ED8" }}>{c.kagawad || "—"}</td>
                      <td><Badge status={c.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
