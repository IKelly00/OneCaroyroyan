import Modal from "../ui/Modal";
import { useModal } from "../../context/ModalContext";

/*
 * NewCertModal
 * ------------------------------------------------------------------
 * Port of #modal-new-cert. Like the original, this form doesn't
 * persist anywhere — "Verify & Issue Certificate" closes this modal
 * and opens the (also static) certificate preview, exactly matching
 * the original's chained
 *   onclick="closeModal('modal-new-cert');showCertPreview()"
 * A real implementation would read the form fields into state here
 * and pass them as the certPreview modal's payload.
 * ------------------------------------------------------------------
 */
export default function NewCertModal() {
  const { closeModal, openModal } = useModal();

  return (
    <Modal title="Process Certificate Request" onClose={closeModal} size="lg" footer={
      <>
        <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
        <button className="btn btn-primary" onClick={() => openModal("certPreview")}>
          Verify & Issue Certificate
        </button>
      </>
    }>
      <div className="form-grid grid-col-2">
        <div className="form-col-2">
          <label className="f-label">Certificate Type</label>
          <select className="f-input">
            <option>Barangay Clearance</option>
            <option>Certificate of Residency</option>
            <option>Certificate of Indigency</option>
            <option>Business Clearance</option>
            <option>Certificate of Good Moral Character</option>
          </select>
        </div>
        <div className="form-col-2">
          <label className="f-label">Resident Name</label>
          <input className="f-input" placeholder="Search resident name..." />
        </div>
        <div>
          <label className="f-label">Resident ID</label>
          <input className="f-input" placeholder="Auto-filled from records" />
        </div>
        <div>
          <label className="f-label">Purok / Address</label>
          <input className="f-input" placeholder="Auto-filled from records" />
        </div>
        <div className="form-col-2">
          <label className="f-label">Purpose of Certificate</label>
          <input className="f-input" placeholder="e.g. Employment, Scholarship" />
        </div>
        <div>
          <label className="f-label">Validity Period</label>
          <select className="f-input">
            <option>6 Months</option>
            <option>1 Year</option>
            <option>One-time use</option>
          </select>
        </div>
        <div>
          <label className="f-label">Fee (₱)</label>
          <input className="f-input" placeholder="Based on approved schedule" />
        </div>
        <div className="form-col-2">
          <div className="info-box">
            <strong>Template Preview:</strong> Certificate text will be auto-generated from
            the selected template. Administrator must verify resident identity before issuing.
          </div>
        </div>
      </div>
    </Modal>
  );
}
