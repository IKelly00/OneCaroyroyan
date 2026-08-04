import { useState, useMemo } from "react";
import { RESIDENTS } from "../data/mockData";
import Badge from "../components/ui/Badge";
import IconButton from "../components/ui/IconButton";
import { useModal } from "../context/ModalContext";

/*
 * Residents — port of #page-residents.
 * The original's search input was decorative (no filtering wired up).
 * We wire it for real here — a small, self-contained improvement that
 * doesn't change any other behavior.
 */
export default function Residents() {
  const { openModal } = useModal();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RESIDENTS;
    return RESIDENTS.filter(
      (r) => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Resident Records</h1>
          <p>Registry of all barangay residents</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-print" onClick={() => openModal("print", { type: "resident-masterlist" })}>
            <svg viewBox="0 0 24 24"><polyline points="6,9 6,2 18,2 18,9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
            Export Masterlist PDF
          </button>
          <button className="btn btn-primary" onClick={() => openModal("addResident")}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Resident
          </button>
        </div>
      </div>

      <div className="search-row">
        <div className="search-wrap">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            className="search-input"
            placeholder="Search by name or resident ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-outline btn-sm">
          <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: "currentColor", fill: "none", strokeWidth: 2 }}>
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
          </svg>
          Filter
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Resident ID</th><th>Full Name</th><th>Age</th><th>Gender</th>
              <th>Civil Status</th><th>Purok</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td><span className="mono">{r.id}</span></td>
                <td><strong>{r.name}</strong></td>
                <td>{r.age}</td>
                <td>{r.gender}</td>
                <td>{r.civil}</td>
                <td>{r.purok}</td>
                <td><Badge status={r.status} /></td>
                <td>
                  <IconButton icon="eye" title="View" onClick={() => openModal("addResident")} />
                  <IconButton icon="edit" title="Edit" onClick={() => openModal("addResident")} />
                  <IconButton icon="file" title="Issue Cert" onClick={() => openModal("newCert")} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 10 }}>
        Showing {filtered.length} of {RESIDENTS.length} residents
      </div>
    </div>
  );
}
