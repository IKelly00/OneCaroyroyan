import Badge from "../../components/ui/Badge";
import IconButton from "../../components/ui/IconButton";

const USERS = [
  { id: "USR-001", name: "Maria Admin", role: "Administrator", user: "madmin", status: "Active", login: "Mar 1, 2026" },
  { id: "USR-002", name: "Leonora Dela Cruz", role: "Barangay Secretary", user: "ldelacruz", status: "Active", login: "Mar 1, 2026" },
  { id: "USR-003", name: "Alma Cruz", role: "Accounting Clerk", user: "acruz", status: "Active", login: "Mar 1, 2026" },
  { id: "USR-004", name: "Rosario Bautista", role: "Treasurer", user: "rbautista", status: "Active", login: "Feb 28, 2026" },
  { id: "USR-005", name: "Ricardo Santos", role: "Barangay Captain", user: "rsantos", status: "Active", login: "Mar 1, 2026" },
];

/*
 * UsersTab — port of SETTINGS_CONTENT.users. Only the Administrator
 * role gets edit/reset actions and the "Add User Account" button —
 * everyone else (not just the read-only Captain) sees a locked view,
 * matching the original's `currentRole==="Administrator"` checks.
 */
export default function UsersTab({ currentRole }) {
  const isAdmin = currentRole === "Administrator";

  return (
    <div className="settings-section">
      <div className="settings-section-title">User Account Management</div>
      {!isAdmin && (
        <div className="warn-box" style={{ marginBottom: 14 }}>
          🔒 Only the Administrator can manage user accounts.
        </div>
      )}
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>User ID</th><th>Full Name</th><th>Role</th><th>Username</th><th>Status</th><th>Last Login</th><th>Action</th></tr>
          </thead>
          <tbody>
            {USERS.map((u) => (
              <tr key={u.id}>
                <td><span className="mono">{u.id}</span></td>
                <td><strong>{u.name}</strong></td>
                <td><span className="badge badge-blue" style={{ fontSize: 10 }}>{u.role}</span></td>
                <td style={{ fontFamily: "monospace", fontSize: 11 }}>{u.user}</td>
                <td><Badge status={u.status} /></td>
                <td style={{ fontSize: 11, color: "#94a3b8" }}>{u.login}</td>
                <td>
                  {isAdmin ? (
                    <>
                      <IconButton icon="edit" title="Edit" onClick={() => {}} />
                      <IconButton icon="eye" title="Reset Password" onClick={() => {}} />
                    </>
                  ) : (
                    <span style={{ color: "#94a3b8", fontSize: 12 }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isAdmin && (
        <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
          <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#fff", fill: "none", strokeWidth: 2.5 }}>
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add User Account
        </button>
      )}
    </div>
  );
}
