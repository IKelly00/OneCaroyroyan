import { CAPTAIN_REPORTS } from "../data/mockData";
import { useModal } from "../context/ModalContext";

/* Port of #page-captain-reports. captain-report-cards -> CAPTAIN_REPORTS.map() */
export default function CaptainReports() {
  const { openModal } = useModal();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Summary Reports</h1>
          <p>Read-only access to all barangay reports</p>
        </div>
        <button className="btn-print" onClick={() => openModal("print", { type: "all-reports" })}>
          <svg viewBox="0 0 24 24"><polyline points="6,9 6,2 18,2 18,9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
          Print All Reports PDF
        </button>
      </div>

      <div className="view-only-banner">
        <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
        View-Only Access — Barangay Captain monitors reports and analytics only
      </div>

      <div className="report-grid">
        {CAPTAIN_REPORTS.map((r) => (
          <div className="report-card" key={r.t}>
            <div className={`report-icon ${r.c}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <div>
              <div className="report-title">{r.t}</div>
              <div className="report-desc">{r.d}</div>
              <div className="report-actions">
                <select><option>This Month</option><option>Last Month</option><option>This Year</option></select>
                <button className="btn btn-primary btn-sm" onClick={() => openModal("print", { type: "report" })}>
                  <svg viewBox="0 0 24 24" style={{ width: 11, height: 11, stroke: "#fff", fill: "none", strokeWidth: 2.5 }}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  View PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
