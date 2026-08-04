/*
 * SettingsRow — replaces the sRow(label, sub, val, type) template helper.
 * `readOnly` mirrors the original's `currentRole==="Barangay Captain"` check,
 * passed down from Settings.jsx instead of read from a global.
 */
export default function SettingsRow({ label, sub, defaultValue, type = "input", readOnly = false }) {
  return (
    <div className="s-row">
      <div>
        <div className="s-key">{label}</div>
        {sub && <div className="s-sub">{sub}</div>}
      </div>
      <div>
        {type === "textarea" ? (
          <textarea className="f-input" rows={2} defaultValue={defaultValue} readOnly={readOnly} />
        ) : (
          <input className="f-input" defaultValue={defaultValue} readOnly={readOnly} />
        )}
      </div>
    </div>
  );
}
