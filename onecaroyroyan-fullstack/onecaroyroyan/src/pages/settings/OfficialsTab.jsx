import SettingsRow from "../../components/ui/SettingsRow";
import SaveButton from "../../components/ui/SaveButton";

export default function OfficialsTab({ readOnly }) {
  return (
    <div className="settings-section">
      <div className="settings-section-title">Barangay Officials Directory</div>
      <SettingsRow label="Punong Barangay" sub="Barangay Captain" defaultValue="Hon. Ricardo M. Santos" readOnly={readOnly} />
      <SettingsRow label="Barangay Secretary" sub="Official secretary" defaultValue="Leonora T. Dela Cruz" readOnly={readOnly} />
      <SettingsRow label="Barangay Treasurer" sub="Official treasurer" defaultValue="Rosario B. Bautista" readOnly={readOnly} />
      <SettingsRow label="1st Kagawad" sub="SB Member" defaultValue="Hon. Ramon Reyes" readOnly={readOnly} />
      <SettingsRow label="2nd Kagawad" sub="SB Member" defaultValue="Hon. Celia Santos" readOnly={readOnly} />
      <SettingsRow label="3rd Kagawad" sub="SB Member" defaultValue="Hon. Edgar Lim" readOnly={readOnly} />
      <SettingsRow label="4th Kagawad" sub="SB Member" defaultValue="Hon. Natividad Cruz" readOnly={readOnly} />
      <SettingsRow label="5th Kagawad" sub="SB Member" defaultValue="Hon. Ferdinand Bautista" readOnly={readOnly} />
      <SettingsRow label="6th Kagawad" sub="SB Member" defaultValue="Hon. Gloria Mendoza" readOnly={readOnly} />
      <SettingsRow label="7th Kagawad" sub="SB Member" defaultValue="Hon. Arturo Garcia" readOnly={readOnly} />
      <SettingsRow label="SK Chairperson" sub="Sangguniang Kabataan" defaultValue="Mark A. Villanueva" readOnly={readOnly} />
      <SettingsRow
        label="Lupon Members"
        sub="Conciliation panel"
        defaultValue="Hon. Ramon Reyes, Hon. Celia Santos, Hon. Edgar Lim"
        type="textarea"
        readOnly={readOnly}
      />
      <div style={{ marginTop: 14 }}><SaveButton readOnly={readOnly} /></div>
    </div>
  );
}
