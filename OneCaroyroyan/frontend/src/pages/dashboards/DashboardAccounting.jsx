import { useEffect, useState } from "react";
import { ICONS } from "../../data/mockData";
import StatCard from "../../components/ui/StatCard";
import StatusTag from "../../components/ui/StatusTag";
import Icon from "../../components/ui/Icon";
import { useModal } from "../../context/ModalContext";
import { dashboardApi } from "../../lib/api";

const ICONS_ = {
  cash: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  peso: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>',
  print: '<polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
};

/*
 * DashboardAccounting — live version.
 * Stat cards and the recording log now come from GET /api/dashboard/accounting
 * (backend/controllers/dashboardController.js) instead of the static
 * PAYMENTS array in mockData.js.
 */
export default function DashboardAccounting() {
  const { openModal } = useModal();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    dashboardApi.accounting().then(setStats).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  return (
    <div>
      <div className="page-header">
        <div><h1>Accounting Clerk Dashboard</h1><p>Payment Recording & Official Receipt Issuance</p></div>
      </div>

      {error && <div style={{ color: "#B91C1C", marginBottom: 12 }}>{error}</div>}

      <div className="cards cols-4">
        <StatCard icon={ICONS_.cash} color="bg-blue" label="Payments Recorded" value={loading ? "…" : stats.transactionsToday} sub="Today" />
        <StatCard icon={ICONS_.peso} color="bg-green" label="Cash Collected" value={loading ? "…" : `₱${stats.collectionsToday.toLocaleString()}`} sub="Today" />
        <StatCard icon={ICONS_.file} color="bg-violet" label="Collections This Month" value={loading ? "…" : `₱${stats.collectionsThisMonth.toLocaleString()}`} sub="Official receipts" />
        <StatCard icon={ICONS_.clock} color="bg-amber" label="Pending Validation" value={loading ? "…" : stats.pendingValidation} sub="Awaiting Treasurer" />
      </div>

      <div className="panel">
        <div className="panel-header">
          <div><div className="panel-title">Payment Recording Log</div><div className="panel-sub">Most recent transactions</div></div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-print" onClick={() => openModal("print", { type: "daily-collection" })}>
              <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICONS_.print }} />Print Daily Collection Report
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => openModal("recordPayment", { onSaved: load })}>
              <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICONS_.plus }} />Record Payment
            </button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>OR No.</th><th>Payer</th><th>Certificate Type</th><th>Amount</th><th>Date</th><th>Treasurer Validation</th><th>Action</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "#94a3b8" }}>Loading…</td></tr>
              ) : stats.recentPayments.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "#94a3b8" }}>No payments recorded yet</td></tr>
              ) : (
                stats.recentPayments.map((p) => (
                  <tr key={p.id}>
                    <td><span className="mono">{p.or_no}</span></td>
                    <td><strong>{p.payer}</strong></td>
                    <td style={{ fontSize: 11 }}>{p.type}</td>
                    <td><strong style={{ color: "#059669" }}>₱{Number(p.amount).toLocaleString()}</strong></td>
                    <td style={{ fontSize: 11, color: "#94a3b8" }}>{p.payment_date}</td>
                    <td><StatusTag done={!!p.validated} doneLabel="Validated" pendingLabel="Awaiting" /></td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ gap: 4, padding: "5px 10px", fontSize: 11 }}
                        onClick={() => openModal("orPreview", { payment: p })}
                      >
                        <Icon svg={ICONS.print} size={12} /> Print OR
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
