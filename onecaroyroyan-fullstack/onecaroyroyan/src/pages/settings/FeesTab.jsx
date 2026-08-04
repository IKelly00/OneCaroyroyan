import SaveButton from "../../components/ui/SaveButton";

const FEES = [
  { t: "Barangay Clearance", f: 50, i: 0 },
  { t: "Certificate of Residency", f: 50, i: 0 },
  { t: "Certificate of Indigency", f: 0, i: 0 },
  { t: "Business Clearance", f: 200, i: 100 },
  { t: "Certificate of Good Moral", f: 50, i: 0 },
];

export default function FeesTab({ readOnly }) {
  return (
    <div className="settings-section">
      <div className="settings-section-title">Certificate Fee Schedule (Approved Rates)</div>
      <div className="warn-box" style={{ marginBottom: 14 }}>
        ⚠ Fee rates must be approved by the Sangguniang Barangay before updating.
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Certificate Type</th><th>Fee (₱)</th><th>Indigent Rate (₱)</th><th>Last Updated</th></tr>
          </thead>
          <tbody>
            {FEES.map((r) => (
              <tr key={r.t}>
                <td><strong>{r.t}</strong></td>
                <td><input className="fee-input" defaultValue={r.f} readOnly={readOnly} /></td>
                <td><input className="fee-input" defaultValue={r.i} readOnly={readOnly} /></td>
                <td style={{ fontSize: 11, color: "#94a3b8" }}>Jan 1, 2026</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 14 }}><SaveButton readOnly={readOnly} /></div>
    </div>
  );
}
