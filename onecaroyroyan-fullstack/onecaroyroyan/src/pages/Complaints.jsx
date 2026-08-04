import { COMPLAINTS } from "../data/mockData";
import Badge from "../components/ui/Badge";
import IconButton from "../components/ui/IconButton";
import StatCard from "../components/ui/StatCard";
import { useModal } from "../context/ModalContext";

const ICONS_ = {
  alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>',
  check: '<polyline points="20,6 9,17 4,12"/>',
};

/* Port of #page-complaints. renderComplaints() -> .map() */
export default function Complaints() {
  const { openModal } = useModal();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Complaints / Blotter Management</h1>
          <p>Encode, monitor, and coordinate with Kagawad for resolution</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-print" onClick={() => openModal("print", { type: "blotter-report" })}>
            <svg viewBox="0 0 24 24"><polyline points="6,9 6,2 18,2 18,9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
            Print Blotter Report PDF
          </button>
          <button className="btn btn-amber" onClick={() => openModal("newBlotter")}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Blotter Entry
          </button>
        </div>
      </div>

      <div className="cards cols-4">
        <StatCard icon={ICONS_.alert} color="bg-blue" label="Total Cases" value="42" />
        <StatCard icon={ICONS_.clock} color="bg-amber" label="Pending" value="12" />
        <StatCard icon={ICONS_.users} color="bg-violet" label="Under Mediation" value="8" />
        <StatCard icon={ICONS_.check} color="bg-green" label="Resolved" value="18" />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Blotter No.</th><th>Complainant</th><th>Respondent</th><th>Nature</th>
              <th>Kagawad Assigned</th><th>Date Filed</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {COMPLAINTS.map((c) => (
              <tr key={c.no}>
                <td><span className="mono">{c.no}</span></td>
                <td><strong>{c.complainant}</strong></td>
                <td>{c.respondent}</td>
                <td style={{ fontSize: 11 }}>{c.nature}</td>
                <td style={{ fontSize: 11, color: "#1D4ED8", fontWeight: 600 }}>{c.kagawad}</td>
                <td style={{ fontSize: 11, color: "#94a3b8" }}>{c.date}</td>
                <td><Badge status={c.status} /></td>
                <td>
                  <IconButton icon="eye" title="View Full Case" onClick={() => openModal("newBlotter")} />
                  <IconButton icon="gavel" title="Update Kagawad" onClick={() => openModal("newBlotter")} />
                  <IconButton icon="print" title="Print" onClick={() => openModal("print", { type: "blotter-report" })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
