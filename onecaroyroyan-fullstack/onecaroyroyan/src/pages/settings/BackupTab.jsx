const ACTIVITY = [
  { t: "Mar 1, 2026 2:14 PM", u: "acruz", a: "Recorded Payment — OR-2026-0201", m: "Payments" },
  { t: "Mar 1, 2026 1:52 PM", u: "madmin", a: "Issued Certificate CR-2026-0481", m: "Certificates" },
  { t: "Mar 1, 2026 1:30 PM", u: "ldelacruz", a: "Logged Correspondence COR-2026-0089", m: "Correspondence" },
  { t: "Mar 1, 2026 11:05 AM", u: "rbautista", a: "Validated Payment OR-2026-0199", m: "Payments" },
  { t: "Mar 1, 2026 10:22 AM", u: "madmin", a: "Added Resident Record 2024-007", m: "Residents" },
];

/* Port of SETTINGS_CONTENT.backup. Only Administrator sees "Backup Now". */
export default function BackupTab({ currentRole }) {
  const isAdmin = currentRole === "Administrator";

  return (
    <div className="settings-section">
      <div className="settings-section-title">System Backup & Audit Logs</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ border: "1.5px solid #E2E8F0", borderRadius: 11, padding: 16, textAlign: "center" }}>
          <svg viewBox="0 0 24 24" style={{ width: 28, height: 28, stroke: "#1D4ED8", fill: "none", strokeWidth: 1.5, margin: "0 auto 8px", display: "block" }}>
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1E293B" }}>Last Backup</div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>Feb 29, 2026 — 11:59 PM</div>
          {isAdmin && <button className="btn btn-primary btn-sm" style={{ marginTop: 10 }}>Backup Now</button>}
        </div>
        <div style={{ border: "1.5px solid #E2E8F0", borderRadius: 11, padding: 16, textAlign: "center" }}>
          <svg viewBox="0 0 24 24" style={{ width: 28, height: 28, stroke: "#059669", fill: "none", strokeWidth: 1.5, margin: "0 auto 8px", display: "block" }}>
            <polyline points="9,11 12,14 22,4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1E293B" }}>Audit Trail</div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>124 actions logged today</div>
          <button className="btn btn-outline btn-sm" style={{ marginTop: 10 }}>View Logs</button>
        </div>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1E293B", marginBottom: 10 }}>Recent System Activity</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Module</th><th>Status</th></tr></thead>
          <tbody>
            {ACTIVITY.map((l, i) => (
              <tr key={i}>
                <td style={{ fontSize: 11, color: "#94a3b8" }}>{l.t}</td>
                <td><span className="mono">{l.u}</span></td>
                <td style={{ fontSize: 11 }}>{l.a}</td>
                <td><span className="badge badge-gray" style={{ fontSize: 10 }}>{l.m}</span></td>
                <td><span style={{ fontSize: 11, fontWeight: 700, color: "#059669" }}>Success</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
