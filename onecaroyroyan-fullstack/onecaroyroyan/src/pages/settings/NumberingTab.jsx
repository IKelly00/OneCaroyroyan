import SaveButton from "../../components/ui/SaveButton";

const SERIES = [
  { l: "Certificate Request No.", p: "CR", n: "CR-2026-0481" },
  { l: "Official Receipt No.", p: "OR", n: "OR-2026-0201" },
  { l: "Blotter Case No.", p: "BLT", n: "BLT-2026-042" },
  { l: "Correspondence Track No.", p: "COR", n: "COR-2026-0089" },
  { l: "Resident ID Format", p: "YYYY", n: "2024-001" },
];

export default function NumberingTab({ readOnly }) {
  return (
    <div className="settings-section">
      <div className="settings-section-title">Document Numbering & Series Configuration</div>
      <div className="info-box" style={{ marginBottom: 14 }}>
        Format: PREFIX-YEAR-NNNN — Configure the current series for all system documents.
      </div>
      {SERIES.map((r) => (
        <div className="s-row" key={r.l}>
          <div><div className="s-key">{r.l}</div></div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input className="f-input" defaultValue={r.p} style={{ width: 72, fontSize: 12 }} readOnly={readOnly} />
            <span style={{ color: "#94a3b8", fontSize: 12 }}>→ Next:</span>
            <input className="f-input" defaultValue={r.n} style={{ fontFamily: "monospace", flex: 1, fontSize: 12 }} readOnly={readOnly} />
          </div>
        </div>
      ))}
      <div style={{ marginTop: 14 }}><SaveButton readOnly={readOnly} /></div>
    </div>
  );
}
