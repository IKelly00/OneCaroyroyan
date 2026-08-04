import Modal from "../ui/Modal";
import { useModal } from "../../context/ModalContext";

export default function LogLetterModal() {
  const { closeModal } = useModal();

  return (
    <Modal title="Log & Digitize Incoming Correspondence" onClose={closeModal} size="lg" footer={
      <>
        <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
        <button className="btn btn-primary" onClick={closeModal}>Save & Mark as Digitized</button>
      </>
    }>
      <div className="form-grid grid-col-2">
        <div><label className="f-label">Tracking No.</label><input className="f-input" placeholder="Auto-generated" /></div>
        <div><label className="f-label">Date Received</label><input className="f-input" type="date" /></div>
        <div className="form-col-2">
          <label className="f-label">Sender / Office</label>
          <input className="f-input" placeholder="Name of sender or office" />
        </div>
        <div>
          <label className="f-label">Correspondence Type</label>
          <select className="f-input">
            <option>Official Letter</option><option>Memo Circular</option><option>Advisory</option>
            <option>Invitation</option><option>Notice</option><option>Report</option><option>Others</option>
          </select>
        </div>
        <div>
          <label className="f-label">Action Required</label>
          <select className="f-input">
            <option>For Information</option><option>For Action</option><option>For Filing</option><option>For Endorsement</option>
          </select>
        </div>
        <div className="form-col-2">
          <label className="f-label">Subject</label>
          <input className="f-input" placeholder="Subject of the communication" />
        </div>
        <div className="form-col-2">
          <label className="f-label">Summary / Encoded Content</label>
          <textarea className="f-input" placeholder="Type or paste digitized content here..." />
        </div>
        <div className="form-col-2">
          <label className="f-label">Initial Status</label>
          <select className="f-input"><option>Received</option><option>For Action</option><option>Acknowledged</option></select>
        </div>
      </div>
    </Modal>
  );
}
