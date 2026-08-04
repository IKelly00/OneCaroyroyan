import Modal from "../ui/Modal";
import { useModal } from "../../context/ModalContext";

/*
 * ORPreviewModal
 * ------------------------------------------------------------------
 * Port of #modal-or-preview — same "static mockup" caveat as
 * CertPreviewModal: original always showed this exact Maria Santos /
 * OR-2026-0201 example.
 * ------------------------------------------------------------------
 */
export default function ORPreviewModal() {
  const { closeModal } = useModal();

  return (
    <Modal title="Official Receipt Preview" onClose={closeModal} size="md" footer={
      <>
        <button className="btn btn-outline" onClick={closeModal}>Close</button>
        <button className="btn btn-primary" onClick={closeModal}>
          <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: "#fff", fill: "none", strokeWidth: 2.5 }}>
            <polyline points="6,9 6,2 18,2 18,9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print Official Receipt PDF
        </button>
      </>
    }>
      <div className="or-doc">
        <div className="or-head">
          <div className="or-gov">Republic of the Philippines</div>
          <div className="or-bgy">BARANGAY CAROYROYAN</div>
          <div className="or-gov">Pili, Camarines Sur</div>
          <div className="or-title-bar"><div className="or-title">OFFICIAL RECEIPT</div></div>
        </div>
        <div className="or-row"><span className="or-key">OR No.:</span><span className="or-val" style={{ color: "#1D4ED8" }}>OR-2026-0201</span></div>
        <div className="or-row"><span className="or-key">Date:</span><span className="or-val">March 1, 2026</span></div>
        <div className="or-row"><span className="or-key">Received from:</span><span className="or-val">MARIA SANTOS</span></div>
        <div className="or-row"><span className="or-key">The sum of:</span><span className="or-val">FIFTY PESOS (₱50.00)</span></div>
        <div className="or-row"><span className="or-key">As payment for:</span><span className="or-val">Barangay Clearance</span></div>
        <div className="or-row"><span className="or-key">Certificate Ref.:</span><span className="or-val">CR-2026-0481</span></div>
        <div className="or-total">
          <div className="or-total-box">
            <div className="or-total-label">Total Amount Paid</div>
            <div className="or-total-val">₱50.00</div>
          </div>
        </div>
        <div className="or-sigs">
          <div className="or-sig">
            <div className="or-sig-line" />
            <div className="or-sig-name">ALMA T. CRUZ</div>
            <div className="or-sig-role">Accounting Clerk</div>
          </div>
          <div className="or-sig">
            <div className="or-sig-line" />
            <div className="or-sig-name">ROSARIO B. BAUTISTA</div>
            <div className="or-sig-role">Barangay Treasurer</div>
          </div>
        </div>
        <div className="or-note">This is an official document — Not valid when altered.</div>
      </div>
    </Modal>
  );
}
