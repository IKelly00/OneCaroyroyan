import SettingsRow from "../../components/ui/SettingsRow";
import SaveButton from "../../components/ui/SaveButton";

export default function BarangayInfoTab({ readOnly }) {
  return (
    <div className="settings-section">
      <div className="settings-section-title">Barangay Basic Information</div>
      <SettingsRow label="Barangay Name" sub="Official registered name" defaultValue="Barangay Caroyroyan" readOnly={readOnly} />
      <SettingsRow label="Municipality" sub="Municipality of the barangay" defaultValue="Pili" readOnly={readOnly} />
      <SettingsRow label="Province" sub="Province or city" defaultValue="Camarines Sur" readOnly={readOnly} />
      <SettingsRow label="Region" sub="Administrative region" defaultValue="Region V — Bicol Region" readOnly={readOnly} />
      <SettingsRow label="Barangay Code" sub="PhilSys/PSGC Code" defaultValue="051716014" readOnly={readOnly} />
      <SettingsRow label="Contact Number" sub="Official barangay hotline" defaultValue="(054) 871-XXXX" readOnly={readOnly} />
      <SettingsRow label="Email Address" sub="Official email" defaultValue="bgy.caroyroyan@pili.gov.ph" readOnly={readOnly} />
      <SettingsRow
        label="Physical Address"
        sub="Office location"
        defaultValue="Barangay Hall, Caroyroyan, Pili, Camarines Sur 4418"
        type="textarea"
        readOnly={readOnly}
      />
      <div style={{ marginTop: 14 }}><SaveButton readOnly={readOnly} /></div>
    </div>
  );
}
