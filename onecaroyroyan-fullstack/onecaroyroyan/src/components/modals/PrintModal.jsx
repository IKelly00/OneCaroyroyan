import Modal from "../ui/Modal";
import { useModal } from "../../context/ModalContext";
import { PRINT_TITLES } from "../../data/mockData";

/*
 * PrintModal
 * ------------------------------------------------------------------
 * Port of #modal-print. The original's showPrintModal(type) set two
 * bits of DOM text before opening: the title (via PRINT_TITLES[type])
 * and a fixed info-box message. Here, `type` arrives as
 * activeModal.payload.type — see useModal()'s `payload` field.
 * ------------------------------------------------------------------
 */
export default function PrintModal({ payload }) {
  const { closeModal } = useModal();
  const title = PRINT_TITLES[payload?.type] || "Export PDF Report";

  return (
    <Modal title={title} onClose={closeModal} size="sm" footer={
      <>
        <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
        <button className="btn btn-primary" onClick={closeModal}>
          <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: "#fff", fill: "none", strokeWidth: 2.5 }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export & Download PDF
        </button>
      </>
    }>
      <div className="form-grid">
        <div>
          <label className="f-label">Report Period</label>
          <select className="f-input">
            <option>This Month (March 2026)</option>
            <option>Last Month (February 2026)</option>
            <option>This Quarter</option>
            <option>This Year (2026)</option>
            <option>Custom Range</option>
          </select>
        </div>
        <div>
          <label className="f-label">File Format</label>
          <select className="f-input">
            <option>PDF Document (.pdf)</option>
            <option>Word Document (.docx)</option>
          </select>
        </div>
        <div className="info-box">
          This will generate a formatted PDF report for official use. The document will
          include the official barangay letterhead and dry seal.
        </div>
      </div>
    </Modal>
  );
}
