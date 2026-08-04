import { CORRESPONDENCE } from "../data/mockData";
import Badge from "../components/ui/Badge";
import StatusTag from "../components/ui/StatusTag";
import IconButton from "../components/ui/IconButton";
import StatCard from "../components/ui/StatCard";
import { useModal } from "../context/ModalContext";

const ICONS_ = {
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>',
  check: '<polyline points="20,6 9,17 4,12"/>',
  alertCircle: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
};

/* Port of #page-correspondence. renderCorrespondence() -> .map() */
export default function Correspondence() {
  const { openModal } = useModal();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Correspondence Tracking</h1>
          <p>Digitize and monitor all incoming official communications</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-print" onClick={() => openModal("print", { type: "correspondence-log" })}>
            <svg viewBox="0 0 24 24"><polyline points="6,9 6,2 18,2 18,9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
            Print Correspondence Log PDF
          </button>
          <button className="btn btn-primary" onClick={() => openModal("logLetter")}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Log & Digitize Letter
          </button>
        </div>
      </div>

      <div className="cards cols-4">
        <StatCard icon={ICONS_.mail} color="bg-blue" label="Total Received" value="89" />
        <StatCard icon={ICONS_.clock} color="bg-amber" label="For Action" value="5" />
        <StatCard icon={ICONS_.check} color="bg-green" label="Filed / Archived" value="72" />
        <StatCard icon={ICONS_.alertCircle} color="bg-rose" label="Not Digitized" value="2" />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tracking No.</th><th>Sender / Office</th><th>Type</th><th>Subject</th>
              <th>Date Received</th><th>Digitized</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {CORRESPONDENCE.map((c) => (
              <tr key={c.trackNo}>
                <td><span className="mono">{c.trackNo}</span></td>
                <td><strong>{c.sender}</strong></td>
                <td style={{ fontSize: 11 }}>{c.type}</td>
                <td style={{ fontSize: 11, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#64748B" }}>
                  {c.subject}
                </td>
                <td style={{ fontSize: 11, color: "#94a3b8" }}>{c.date}</td>
                <td><StatusTag done={c.digitized} doneLabel="Digitized" pendingLabel="Pending" /></td>
                <td><Badge status={c.status} /></td>
                <td>
                  <IconButton icon="eye" title="View" onClick={() => openModal("logLetter")} />
                  <IconButton icon="edit" title="Update" onClick={() => openModal("logLetter")} />
                  <IconButton icon="print" title="Print" onClick={() => openModal("print", { type: "correspondence-log" })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
