import { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import StatCard from "../../components/ui/StatCard";
import { useModal } from "../../context/ModalContext";
import { dashboardApi } from "../../lib/api";

const ICONS_ = {
  check: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  peso: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>',
  print: '<polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
};

const doughnutOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom", labels: { font: { size: 10 }, boxWidth: 10 } } },
};

const overviewOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom", labels: { font: { size: 10 }, boxWidth: 10 } } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
    y: { grid: { color: "#f1f5f9" }, ticks: { font: { size: 10 } } },
  },
};

const PALETTE = ["#1D4ED8", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"];
const STATUS_COLORS = { Resolved: "#10B981", "Under Mediation": "#F59E0B", Pending: "#EF4444", "Referred to PNP": "#8B5CF6" };

/*
 * DashboardCaptain — live version, read-only executive view backed by
 * GET /api/dashboard/captain (real totals + GROUP BY breakdowns from
 * MySQL) and GET /api/dashboard/monthly-trend for the issuance/
 * collections bar chart. Notifications remain illustrative UI copy —
 * there's no notifications table in this schema.
 */
export default function DashboardCaptain() {
  const { openModal } = useModal();
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([dashboardApi.captain(), dashboardApi.monthlyTrend()])
      .then(([s, t]) => {
        setStats(s);
        setTrend(t);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const certTypeData = stats && {
    labels: stats.certsByType.map((c) => c.type),
    datasets: [{ data: stats.certsByType.map((c) => c.count), backgroundColor: PALETTE, borderWidth: 0, hoverOffset: 6 }],
  };
  const complaintStatusData = stats && {
    labels: stats.complaintsByStatus.map((c) => c.status),
    datasets: [{
      data: stats.complaintsByStatus.map((c) => c.count),
      backgroundColor: stats.complaintsByStatus.map((c) => STATUS_COLORS[c.status] || "#94A3B8"),
      borderWidth: 0, hoverOffset: 6,
    }],
  };
  const overviewData = {
    labels: trend.map((m) => m.month),
    datasets: [
      { label: "Certificates", data: trend.map((m) => m.certificates), backgroundColor: "#1D4ED8", borderRadius: 4, barPercentage: 0.45 },
      { label: "Collections (₱, x100)", data: trend.map((m) => m.collections / 100), backgroundColor: "#10B981", borderRadius: 4, barPercentage: 0.45 },
    ],
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Barangay Captain — Executive Dashboard</h1><p>Barangay Caroyroyan Governance Overview</p></div>
      </div>

      <div className="view-only-banner">
        <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
        View-Only Access — Barangay Captain monitors reports and analytics only
      </div>

      {error && <div style={{ color: "#B91C1C", marginBottom: 12 }}>{error}</div>}

      <div className="cards cols-3">
        <StatCard icon={ICONS_.check} color="bg-blue" label="Total Certs Issued" value={loading ? "…" : stats.totalCertsIssued} sub="All-time" />
        <StatCard icon={ICONS_.peso} color="bg-green" label="Total Collections" value={loading ? "…" : `₱${stats.totalCollections.toLocaleString()}`} sub="All-time" />
        <StatCard icon={ICONS_.alert} color="bg-amber" label="Total Complaints" value={loading ? "…" : stats.totalComplaints} sub={loading ? "" : `${stats.openBlotterCases} still open`} />
      </div>

      <div className="grid-3">
        <div className="panel" style={{ gridColumn: "span 1" }}>
          <div className="panel-header"><div className="panel-title">Certificates by Type</div></div>
          <div className="chart-wrap">{!loading && <Doughnut data={certTypeData} options={doughnutOpts} />}</div>
        </div>
        <div className="panel" style={{ gridColumn: "span 1" }}>
          <div className="panel-header"><div className="panel-title">Complaints Status</div></div>
          <div className="chart-wrap">{!loading && <Doughnut data={complaintStatusData} options={doughnutOpts} />}</div>
        </div>
        <div className="panel" style={{ gridColumn: "span 1" }}>
          <div className="panel-header">
            <div><div className="panel-title">Residents by Purok</div></div>
            <button className="btn-print" onClick={() => openModal("print", { type: "exec-summary" })}>
              <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICONS_.print }} />Print
            </button>
          </div>
          {!loading && stats.residentsByPurok.map((p) => (
            <div className="notif-item" key={p.purok}>
              <div className="notif-icon" style={{ background: "#DBEAFE", color: "#1D4ED8" }}>
                <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              </div>
              <div>
                <div className="notif-msg">{p.purok}</div>
                <div className="notif-time">{p.count} active residents</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div><div className="panel-title">Issuance & Collections Overview</div><div className="panel-sub">Last several months</div></div>
          <button className="btn-print" onClick={() => openModal("print", { type: "exec-summary" })}>
            <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICONS_.print }} />Print Executive Report
          </button>
        </div>
        <div className="chart-wrap" style={{ height: 220 }}>
          {!loading && <Bar data={overviewData} options={overviewOpts} />}
        </div>
      </div>
    </div>
  );
}
