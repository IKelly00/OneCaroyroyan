import Modal from "../ui/Modal";
import { useModal } from "../../context/ModalContext";

export default function NewBlotterModal() {
  const { closeModal } = useModal();

  return (
    <Modal title="New Blotter / Complaint Entry" onClose={closeModal} size="lg" footer={
      <>
        <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
        <button className="btn btn-amber" onClick={closeModal}>Save Blotter Entry</button>
      </>
    }>
      <div className="form-grid grid-col-2">
        <div><label className="f-label">Blotter No.</label><input className="f-input" placeholder="Auto-generated" /></div>
        <div><label className="f-label">Date Filed</label><input className="f-input" type="date" /></div>
        <div className="form-col-2">
          <label className="f-label">Complainant Full Name</label>
          <input className="f-input" placeholder="Full name" />
        </div>
        <div><label className="f-label">Complainant Address</label><input className="f-input" placeholder="Purok / Address" /></div>
        <div><label className="f-label">Contact Number</label><input className="f-input" placeholder="09XXXXXXXXX" /></div>
        <div className="form-col-2">
          <label className="f-label">Respondent Full Name</label>
          <input className="f-input" placeholder="Full name" />
        </div>
        <div>
          <label className="f-label">Nature of Complaint</label>
          <select className="f-input">
            <option>Noise Complaint</option><option>Property Dispute</option><option>Harassment</option>
            <option>Theft</option><option>Physical Injury</option><option>Boundary Dispute</option>
            <option>Verbal Abuse</option><option>Others</option>
          </select>
        </div>
        <div>
          <label className="f-label">Assign Kagawad</label>
          <select className="f-input">
            <option>Hon. Ramon Reyes</option><option>Hon. Celia Santos</option><option>Hon. Edgar Lim</option>
            <option>Hon. Natividad Cruz</option><option>Hon. Ferdinand Bautista</option>
            <option>Hon. Gloria Mendoza</option><option>Hon. Arturo Garcia</option>
          </select>
        </div>
        <div className="form-col-2">
          <label className="f-label">Incident Narrative</label>
          <textarea className="f-input" placeholder="Detailed account of the incident..." />
        </div>
        <div>
          <label className="f-label">Initial Status</label>
          <select className="f-input"><option>Pending</option><option>Under Mediation</option></select>
        </div>
        <div><label className="f-label">Encoded By</label><input className="f-input" placeholder="Barangay Secretary" /></div>
      </div>
    </Modal>
  );
}
