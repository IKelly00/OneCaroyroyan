import { Bar } from "react-chartjs-2";
import { REPORT_TYPES, PAYMENTS, MONTHLY } from "../data/mockData";
import Badge from "../components/ui/Badge";
import { useModal } from "../context/ModalContext";

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (v) => `₱${v.raw}` } },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
    y: { grid: { color: "#f1f5f9" }, ticks: { font: { size: 10 }, callback: (v) => `₱${v}` } },
  },
};

/*
 * FinReports — port of #page-fin-reports.
 * fin-report-cards -> REPORT_TYPES.map(); chart-monthly-col -> <Bar>;
 * tbl-validated -> PAYMENTS.map()
 */
export default function FinReports() {
  const { openModal } = useModal();

  const chartData = {
    labels: MONTHLY.map((m) => m.m),
    datasets: [{ label: "Collections (₱)", data: MONTHLY.map((m) => m.col), backgroundColor: "#1D4ED8", borderRadius: 4 }],
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Financial Reports</h1>
          <p>Generate monthly financial summaries</p>
        </div>
        <button className="btn-print" onClick={() => openModal("print", { type: "all-financial" })}>
          <svg viewBox="0 0 24 24"><polyline points="6,9 6,2 18,2 18,9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
          Export All Financial Reports PDF
        </button>
      </div>

      <div className="report-grid">
        {REPORT_TYPES.map((r) => (
          <div className="report-card" key={r.t}>
            <div className={`report-icon ${r.c}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <div className="report-title">{r.t}</div>
              <div className="report-desc">{r.d}</div>
              <div className="report-actions">
                <select>
                  <option>This Month</option><option>Last Month</option><option>This Quarter</option><option>This Year</option>
                </select>
                <button className="btn btn-primary btn-sm" onClick={() => openModal("print", { type: "financial" })}>
                  <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#fff", fill: "none", strokeWidth: 2.5 }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7,10 12,15 17,10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header"><div className="panel-title">Monthly Collection Trend</div></div>
          <div className="chart-wrap"><Bar data={chartData} options={chartOptions} /></div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Validated Payments</div>
            <div className="panel-sub">February 2026</div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>OR No.</th><th>Payer</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {PAYMENTS.map((p) => (
                  <tr key={p.or}>
                    <td><span className="mono">{p.or}</span></td>
                    <td><strong>{p.payer}</strong></td>
                    <td><strong style={{ color: "#059669" }}>₱{p.amount}</strong></td>
                    <td><Badge status={p.validated ? "Validated" : "Pending Validation"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
