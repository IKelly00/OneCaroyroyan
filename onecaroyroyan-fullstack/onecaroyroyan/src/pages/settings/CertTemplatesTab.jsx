import SaveButton from "../../components/ui/SaveButton";

const TEMPLATE_NAMES = [
  "Barangay Clearance",
  "Certificate of Residency",
  "Certificate of Indigency",
  "Business Clearance",
  "Certificate of Good Moral Character",
];

export default function CertTemplatesTab({ readOnly }) {
  return (
    <div className="settings-section">
      <div className="settings-section-title">Certificate Template Settings</div>
      {TEMPLATE_NAMES.map((name) => (
        <div
          key={name}
          style={{
            border: "1.5px solid #E2E8F0",
            borderRadius: 11,
            padding: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="stat-icon bg-blue" style={{ padding: 8 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="14" height="14">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
              </svg>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700 }}>{name}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div>
              <label className="f-label">Validity</label>
              <select className="f-input" style={{ padding: "6px 8px", fontSize: 11, width: "auto" }} disabled={readOnly}>
                <option>6 Months</option><option>1 Year</option><option>One-time use</option>
              </select>
            </div>
            {!readOnly && <button className="btn btn-outline btn-sm" style={{ fontSize: 11 }}>Edit Template</button>}
          </div>
        </div>
      ))}
      <SaveButton readOnly={readOnly} />
    </div>
  );
}
