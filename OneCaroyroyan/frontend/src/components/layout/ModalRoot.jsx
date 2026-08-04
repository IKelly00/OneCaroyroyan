import { useModal } from "../../context/ModalContext";
import NewCertModal from "../modals/NewCertModal";
import CertPreviewModal from "../modals/CertPreviewModal";
import AddResidentModal from "../modals/AddResidentModal";
import LogLetterModal from "../modals/LogLetterModal";
import NewBlotterModal from "../modals/NewBlotterModal";
import RecordPaymentModal from "../modals/RecordPaymentModal";
import ORPreviewModal from "../modals/ORPreviewModal";
import PrintModal from "../modals/PrintModal";

/*
 * ModalRoot
 * ------------------------------------------------------------------
 * Mounted once in App.jsx, inside <ModalProvider>. Reads `activeModal`
 * from context and renders whichever modal component matches its
 * `name`. Every button in the app that used to call
 * openModal('modal-xyz') now calls useModal().openModal('xyz') from
 * wherever it lives — no need for the modal's JSX to exist near the
 * button that triggers it, same as the original (all 8 modals lived
 * in one block near the bottom of <body>, entirely separate from the
 * buttons that opened them).
 * ------------------------------------------------------------------
 */
const MODAL_COMPONENTS = {
  newCert: NewCertModal,
  certPreview: CertPreviewModal,
  addResident: AddResidentModal,
  logLetter: LogLetterModal,
  newBlotter: NewBlotterModal,
  recordPayment: RecordPaymentModal,
  orPreview: ORPreviewModal,
  print: PrintModal,
};

export default function ModalRoot() {
  const { activeModal } = useModal();
  if (!activeModal) return null;

  const ModalComponent = MODAL_COMPONENTS[activeModal.name];
  if (!ModalComponent) return null;

  return <ModalComponent payload={activeModal.payload} />;
}
