import { PAYMENTS, ICONS } from "../data/mockData";
import Badge from "../components/ui/Badge";
import Icon from "../components/ui/Icon";
import StatCard from "../components/ui/StatCard";
import { useModal } from "../context/ModalContext";

const ICONS_ = {
  cash: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  peso: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>',
};

/* Port of #page-payments. renderPayments() -> .map() */
export default function Payments() {
  const { openModal } = useModal();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Payments &amp; Official Receipts</h1>
          <p>Record cash payments and generate official receipts through the system</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-print" onClick={() => openModal("print", { type: "payment-records" })}>
            <svg viewBox="0 0 24 24"><polyline points="6,9 6,2 18,2 18,9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
            Export Payment Records PDF
          </button>
          <button className="btn btn-success" onClick={() => openModal("recordPayment")}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Record New Payment
          </button>
        </div>
      </div>

      <div className="cards cols-3">
        <StatCard icon={ICONS_.cash} color="bg-blue" label="Transactions Today" value="9" />
        <StatCard icon={ICONS_.peso} color="bg-green" label="Total Collected" value="₱1,850" />
        <StatCard icon={ICONS_.file} color="bg-violet" label="ORs Issued" value="9" />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>OR No.</th><th>Payer Name</th><th>Certificate Type</th><th>Cert. Ref.</th>
              <th>Amount</th><th>Date</th><th>Validation</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {PAYMENTS.map((p) => (
              <tr key={p.or}>
                <td><span className="mono">{p.or}</span></td>
                <td><strong>{p.payer}</strong></td>
                <td style={{ fontSize: 11 }}>{p.type}</td>
                <td><span className="mono" style={{ fontSize: 11, color: "#64748B" }}>{p.certNo}</span></td>
                <td><strong style={{ color: "#059669" }}>₱{p.amount}</strong></td>
                <td style={{ fontSize: 11, color: "#94a3b8" }}>{p.date}</td>
                <td><Badge status={p.validated ? "Validated" : "Pending Validation"} /></td>
                <td style={{ display: "flex", gap: 4 }}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ gap: 4, padding: "5px 8px", fontSize: 10 }}
                    onClick={() => openModal("orPreview")}
                  >
                    <Icon svg={ICONS.eye} size={11} />Preview
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ gap: 4, padding: "5px 8px", fontSize: 10 }}
                    onClick={() => openModal("orPreview")}
                  >
                    <Icon svg={ICONS.print} size={11} />Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
