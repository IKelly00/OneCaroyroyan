import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import IconButton from "../../components/ui/IconButton";
import { useModal } from "../../context/ModalContext";
import { dashboardApi } from "../../lib/api";

const ICON_PATHS = {
  requests: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  issued: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  pending: '<circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>',
  residents:
    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>',
  add: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/>',
  print:
    '<polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  chevron: '<polyline points="9,18 15,12 9,6"/>',
};

const TEMPLATES = [
  "Barangay Clearance",
  "Certificate of Residency",
  "Certificate of Indigency",
  "Business Clearance",
];

/*
 * DashboardAdmin
 * ------------------------------------------------------------------
 * Live version — pulls its stat cards and cert queue from
 * GET /api/dashboard/admin (see backend/controllers/dashboardController.js)
 * instead of the static CERTS array in mockData.js. Verify/Issue
 * actions call the certificates API and then re-fetch so the queue
 * reflects the database immediately.
 * ------------------------------------------------------------------
 */
export default function DashboardAdmin() {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    dashboardApi
      .admin()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Administrator Dashboard</h1>
          <p>Certificate Processing & Resident Records</p>
        </div>
      </div>

      {error && <div style={{ color: "#B91C1C", marginBottom: 12 }}>{error}</div>}

      <div className="cards cols-4">
        <StatCard icon={ICON_PATHS.requests} color="bg-blue" label="Requests Today" value={loading ? "…" : stats.requestsToday} sub={loading ? "" : `${stats.forVerification} for verification`} />
        <StatCard icon={ICON_PATHS.issued} color="bg-green" label="Certs Issued Today" value={loading ? "…" : stats.certsIssuedToday} sub="Via templates" />
        <StatCard icon={ICON_PATHS.pending} color="bg-amber" label="Pending Requests" value={loading ? "…" : stats.pendingRequests} sub="Awaiting processing" />
        <StatCard icon={ICON_PATHS.residents} color="bg-violet" label="Total Residents" value={loading ? "…" : stats.totalResidents} sub="Registered records" />
      </div>

      <div className="grid-2-1">
        <div className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">Certificate Requests Queue</div>
              <div className="panel-sub">Pending processing & verification</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-print" onClick={() => openModal("print", { type: "cert-log" })}>
                <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICON_PATHS.print }} />
                Print Report
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => openModal("newCert", { onSaved: load })}>
                <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                New Request
              </button>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cert. No.</th><th>Resident</th><th>Type</th><th>Purpose</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "#94a3b8" }}>Loading…</td></tr>
                ) : stats.certQueue.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "#94a3b8" }}>Queue is empty</td></tr>
                ) : (
                  stats.certQueue.map((c) => (
                    <tr key={c.id}>
                      <td><span className="mono">{c.cert_no}</span></td>
                      <td><strong>{c.resident_name}</strong></td>
                      <td style={{ fontSize: 11 }}>{c.type}</td>
                      <td style={{ fontSize: 11, color: "#64748B" }}>{c.purpose}</td>
                      <td><Badge status={c.status} /></td>
                      <td>
                        <IconButton icon="eye" title="Preview" onClick={() => openModal("certPreview", { certificate: c })} />
                        {c.verified ? (
                          <IconButton icon="print" title="Print" onClick={() => openModal("certPreview", { certificate: c })} />
                        ) : (
                          <IconButton icon="check" title="Verify" onClick={() => openModal("certPreview", { certificate: c, onVerified: load })} />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="panel" style={{ marginBottom: 14 }}>
            <div className="panel-header"><div className="panel-title">Certificate Templates</div></div>
            {TEMPLATES.map((name) => (
              <button key={name} className="tpl-btn" onClick={() => openModal("newCert", { type: name, onSaved: load })}>
                <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICON_PATHS.file }} />
                {name}
                <svg className="tpl-chevron" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICON_PATHS.chevron }} />
              </button>
            ))}
          </div>

          <div className="panel">
            <div className="panel-header"><div className="panel-title">Quick Actions</div></div>
            <button className="quick-btn" onClick={() => openModal("newCert", { onSaved: load })}>
              <div className="quick-icon bg-blue"><svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICON_PATHS.file }} /></div>
              Process Certificate Request
            </button>
            <button className="quick-btn" onClick={() => navigate("/app/residents")}>
              <div className="quick-icon bg-green"><svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICON_PATHS.add }} /></div>
              Add New Resident Record
            </button>
            <button className="quick-btn" onClick={() => openModal("print", { type: "cert-log" })}>
              <div className="quick-icon bg-violet"><svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICON_PATHS.print }} /></div>
              Print Issued Certificates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
