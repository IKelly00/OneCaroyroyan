import Modal from "../ui/Modal";
import { useModal } from "../../context/ModalContext";

export default function AddResidentModal() {
  const { closeModal } = useModal();

  return (
    <Modal title="Add New Resident Record" onClose={closeModal} size="md" footer={
      <>
        <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
        <button className="btn btn-primary" onClick={closeModal}>Save Resident</button>
      </>
    }>
      <div className="form-grid grid-col-2">
        <div><label className="f-label">First Name</label><input className="f-input" placeholder="First name" /></div>
        <div><label className="f-label">Last Name</label><input className="f-input" placeholder="Last name" /></div>
        <div><label className="f-label">Date of Birth</label><input className="f-input" type="date" /></div>
        <div>
          <label className="f-label">Gender</label>
          <select className="f-input"><option>Male</option><option>Female</option></select>
        </div>
        <div>
          <label className="f-label">Civil Status</label>
          <select className="f-input">
            <option>Single</option><option>Married</option><option>Widowed</option><option>Separated</option>
          </select>
        </div>
        <div>
          <label className="f-label">Purok</label>
          <select className="f-input">
            <option>Purok 1</option><option>Purok 2</option><option>Purok 3</option><option>Purok 4</option><option>Purok 5</option>
          </select>
        </div>
        <div className="form-col-2">
          <label className="f-label">Complete Address</label>
          <input className="f-input" placeholder="House No., Street, Purok" />
        </div>
        <div><label className="f-label">Contact Number</label><input className="f-input" placeholder="09XXXXXXXXX" /></div>
        <div><label className="f-label">Occupation</label><input className="f-input" placeholder="Occupation" /></div>
      </div>
    </Modal>
  );
}
