import { useState } from "react";
import { SETTINGS_TABS } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/ui/Icon";
import BarangayInfoTab from "./settings/BarangayInfoTab";
import OfficialsTab from "./settings/OfficialsTab";
import SignatoryTab from "./settings/SignatoryTab";
import CertTemplatesTab from "./settings/CertTemplatesTab";
import FeesTab from "./settings/FeesTab";
import NumberingTab from "./settings/NumberingTab";
import UsersTab from "./settings/UsersTab";
import BackupTab from "./settings/BackupTab";

/*
 * Settings — port of #page-settings.
 * activeSettingsTab (a bare module-level `let` in the original,
 * mutated by switchSettingsTab()) becomes ordinary useState here.
 * SETTINGS_CONTENT[key]() function calls become a lookup table of
 * components instead — same shape, React-idiomatic swap.
 */
const TAB_COMPONENTS = {
  barangay: BarangayInfoTab,
  officials: OfficialsTab,
  signatory: SignatoryTab,
  certs: CertTemplatesTab,
  fees: FeesTab,
  numbering: NumberingTab,
  users: UsersTab,
  backup: BackupTab,
};

export default function Settings() {
  const { currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState("barangay");

  const isCaptain = currentRole === "Barangay Captain";
  const ActiveTabComponent = TAB_COMPONENTS[activeTab] || BarangayInfoTab;

  return (
    <div>
      <div className="page-header">
        <div><h1>System Settings</h1><p>Configure barangay system parameters and preferences</p></div>
      </div>

      {isCaptain && (
        <div className="view-only-banner">
          <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
          View-Only Access — Barangay Captain can view settings but cannot modify them
        </div>
      )}

      <div className="settings-layout">
        <div className="settings-tabs">
          {SETTINGS_TABS.map((t) => (
            <button
              key={t.k}
              className={`settings-tab${activeTab === t.k ? " active" : ""}`}
              onClick={() => setActiveTab(t.k)}
              type="button"
            >
              <Icon svg={t.icon} size={15} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
        <div>
          <ActiveTabComponent readOnly={isCaptain} currentRole={currentRole} />
        </div>
      </div>
    </div>
  );
}
