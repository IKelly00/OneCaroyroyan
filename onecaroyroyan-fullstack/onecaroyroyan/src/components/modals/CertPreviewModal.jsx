import Modal from "../ui/Modal";
import { useModal } from "../../context/ModalContext";

/*
 * CertPreviewModal
 * ------------------------------------------------------------------
 * Port of #modal-cert-preview. The original always showed this exact
 * Jose Bautista / CR-2026-0480 example regardless of which queue row
 * you clicked "Preview" on — it was a static UI mockup, not wired to
 * real row data. Preserved as-is here for fidelity; a production
 * version would read `payload` (the clicked CERTS row) instead of
 * these hard-coded values.
 * ------------------------------------------------------------------
 */
export default function CertPreviewModal() {
  const { closeModal } = useModal();

  return (
    <Modal title="Certificate Print Preview" onClose={closeModal} size="lg" footer={
      <>
        <button className="btn btn-outline" onClick={closeModal}>Close</button>
        <button className="btn btn-primary" onClick={closeModal}>
          <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: "#fff", fill: "none", strokeWidth: 2.5 }}>
            <polyline points="6,9 6,2 18,2 18,9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print Certificate PDF
        </button>
      </>
    }>
      <div className="cert-doc">
        <div className="cert-header">
          <div className="cert-sup">Republic of the Philippines</div>
          <div className="cert-sup">Province of Camarines Sur · Municipality of Pili</div>
          <div className="cert-title">Barangay Caroyroyan</div>
          <div className="cert-divider" />
          <div className="cert-title" style={{ fontSize: 14 }}>Certificate of Residency</div>
          <div className="cert-no">No. CR-2026-0480</div>
        </div>
        <div className="cert-body">
          <p>TO WHOM IT MAY CONCERN:</p>
          <p>
            This is to certify that <strong>JOSE BAUTISTA</strong>, of legal age, Filipino
            citizen, and a resident of{" "}
            <strong>Purok 2, Barangay Caroyroyan, Pili, Camarines Sur</strong>, is a bona fide
            resident of this barangay.
          </p>
          <p>
            This certification is issued upon the request of the above-named person for{" "}
            <strong>SCHOLARSHIP PURPOSES</strong> only.
          </p>
          <p>
            Given this <strong>1st</strong> day of <strong>March 2026</strong> at Barangay
            Caroyroyan, Pili, Camarines Sur, Philippines.
          </p>
        </div>
        <div className="cert-sigs">
          <div className="cert-sig">
            <div className="cert-sig-line" />
            <div className="cert-sig-name">LEONORA T. DELA CRUZ</div>
            <div className="cert-sig-role">Barangay Secretary</div>
          </div>
          <div className="cert-sig">
            <div className="cert-seal">
              <span>
                OFFICIAL
                <br />
                DRY
                <br />
                SEAL
              </span>
            </div>
          </div>
          <div className="cert-sig">
            <div className="cert-sig-line" />
            <div className="cert-sig-name">HON. RICARDO M. SANTOS</div>
            <div className="cert-sig-role">Punong Barangay</div>
          </div>
        </div>
        <div className="cert-footer">
          <span>Fee: ₱50.00 &nbsp;|&nbsp; OR No.: OR-2026-0200</span>
          <span>Not valid without official dry seal</span>
        </div>
      </div>
    </Modal>
  );
}
