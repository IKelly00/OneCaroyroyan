import { useState, useMemo } from "react";
import { CERTS } from "../data/mockData";
import Badge from "../components/ui/Badge";
import IconButton from "../components/ui/IconButton";
import { useModal } from "../context/ModalContext";

const TYPES = ["All", "Barangay Clearance", "Certificate of Residency", "Certificate of Indigency", "Business Clearance"];

/*
 * Certificates — port of #page-certificates. renderCertsTable() -> .map().
 * The original's .pill filter chips didn't actually filter (no onclick
 * wired up) — we wire real filtering here, same reasoning as Residents'
 * search box.
 */
export default function Certificates() {
  const { openModal } = useModal();
  const [activeType, setActiveType] = useState("All");

  const filtered = useMemo(
    () => (activeType === "All" ? CERTS : CERTS.filter((c) => c.type === activeType)),
    [activeType]
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Certificate Generation</h1>
          <p>Process requests using templates — verify before issuing</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-print" onClick={() => openModal("print", { type: "cert-log" })}>
            <svg viewBox="0 0 24 24"><polyline points="6,9 6,2 18,2 18,9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
            Export Issuance Log PDF
          </button>
          <button className="btn btn-primary" onClick={() => openModal("newCert")}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Process New Request
          </button>
        </div>
      </div>

      <div className="filter-pills">
        {TYPES.map((t) => (
          <span
            key={t}
            className={`pill${activeType === t ? " active" : ""}`}
            onClick={() => setActiveType(t)}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cert. No.</th><th>Resident Name</th><th>Type</th><th>Purpose</th>
              <th>Date</th><th>Fee (₱)</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.no}>
                <td><span className="mono">{c.no}</span></td>
                <td><strong>{c.name}</strong></td>
                <td style={{ fontSize: 11 }}>{c.type}</td>
                <td style={{ fontSize: 11, color: "#64748B" }}>{c.purpose}</td>
                <td style={{ fontSize: 11, color: "#94a3b8" }}>{c.date}</td>
                <td>₱{c.fee}</td>
                <td><Badge status={c.status} /></td>
                <td>
                  <IconButton icon="eye" title="Preview" onClick={() => openModal("certPreview")} />
                  <IconButton icon="print" title="Print" onClick={() => openModal("certPreview")} />
                  <IconButton icon="edit" title="Edit" onClick={() => openModal("newCert")} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
