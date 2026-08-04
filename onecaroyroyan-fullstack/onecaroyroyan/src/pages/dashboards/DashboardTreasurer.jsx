import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { ICONS } from "../../data/mockData";
import StatCard from "../../components/ui/StatCard";
import Icon from "../../components/ui/Icon";
import { useModal } from "../../context/ModalContext";
import { dashboardApi, paymentsApi } from "../../lib/api";

const ICONS_ = {
  peso: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  trend: '<polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>',
  check: '<polyline points="20,6 9,17 4,12"/>',
  print: '<polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (v) => `₱${v.raw}` } },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: { grid: { color: "#f1f5f9" }, ticks: { font: { size: 10 }, callback: (v) => `₱${v}` } },
  },
};

/*
 * DashboardTreasurer — live version.
 * Chart data comes from GET /api/dashboard/treasurer (real monthly
 * SUM(amount) grouped by month, see dashboardController.js). Unlike
 * the mock version's fake "Validate" button (which just faded a card's
 * opacity locally), this one calls PATCH /api/payments/:id/validate
 * and re-fetches, so validation is actually persisted in MySQL.
 */
export default function DashboardTreasurer() {
  const { openModal } = useModal();
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([dashboardApi.treasurer(), paymentsApi.list({ validated: "false", limit: 10 })])
      .then(([t, p]) => {
        setStats(t);
        setPending(p.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleValidate = async (id) => {
    try {
      await paymentsApi.validate(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const chartData = stats && {
    labels: stats.monthlyTrend.map((m) => m.month),
    datasets: [
      {
        label: "Collections (₱)",
        data: stats.monthlyTrend.map((m) => Number(m.total)),
        borderColor: "#1D4ED8",
        backgroundColor: "rgba(29,78,216,.08)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#1D4ED8",
        pointRadius: 4,
        borderWidth: 2.5,
      },
    ],
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Treasurer Dashboard</h1><p>Financial Validation & Oversight</p></div>
      </div>

      {error && <div style={{ color: "#B91C1C", marginBottom: 12 }}>{error}</div>}

      <div className="cards cols-4">
        <StatCard icon={ICONS_.peso} color="bg-blue" label="Unvalidated Amount" value={loading ? "…" : `₱${stats.unvalidatedAmount.toLocaleString()}`} sub="Awaiting review" />
        <StatCard icon={ICONS_.trend} color="bg-green" label="Validated This Month" value={loading ? "…" : `₱${stats.validatedCollectionsThisMonth.toLocaleString()}`} sub="Confirmed" />
        <StatCard icon={ICONS_.clock} color="bg-amber" label="Awaiting Validation" value={loading ? "…" : stats.unvalidatedCount} sub="Submitted by Clerk" />
        <StatCard icon={ICONS_.check} color="bg-violet" label="Collection Types" value={loading ? "…" : stats.collectionsByType.length} sub="Distinct categories" />
      </div>

      <div className="grid-2-1">
        <div className="panel">
          <div className="panel-header">
            <div><div className="panel-title">Monthly Cash Flow</div><div className="panel-sub">Last 6 months</div></div>
            <button className="btn-print" onClick={() => openModal("print", { type: "financial-report" })}>
              <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICONS_.print }} />Print Financial Report PDF
            </button>
          </div>
          <div className="chart-wrap">
            {!loading && chartData && <Line data={chartData} options={chartOptions} />}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Pending Validation Queue</div>
            <div className="panel-sub">Submitted by Accounting Clerk</div>
          </div>
          <div id="val-queue">
            {loading ? (
              <div style={{ padding: 16, color: "#94a3b8", fontSize: 13 }}>Loading…</div>
            ) : pending.length === 0 ? (
              <div style={{ padding: 16, color: "#94a3b8", fontSize: 13 }}>Nothing awaiting validation</div>
            ) : (
              pending.map((p) => (
                <div className="val-card" key={p.id}>
                  <div className="val-card-top">
                    <div>
                      <div className="val-card-name">{p.payer}</div>
                      <div className="val-card-type">{p.type}</div>
                      <div className="val-card-or">{p.or_no}</div>
                    </div>
                    <div className="val-card-amount">₱{Number(p.amount).toLocaleString()}</div>
                  </div>
                  <div className="val-card-actions">
                    <button className="btn btn-success btn-sm" onClick={() => handleValidate(p.id)}>
                      <Icon svg={ICONS.check} size={12} /> Validate
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => openModal("orPreview", { payment: p })}>
                      <Icon svg={ICONS.eye} size={12} /> View OR
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
