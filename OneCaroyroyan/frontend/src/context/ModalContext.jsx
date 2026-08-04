import { createContext, useContext, useState, useCallback } from "react";

/*
 * ModalContext
 * ------------------------------------------------------------------
 * Replaces the vanilla app's DOM-based modal system entirely:
 *   function openModal(id){document.getElementById(id).classList.add("open")}
 *   function closeModal(id){document.getElementById(id).classList.remove("open")}
 * ...where every modal <div class="modal-overlay" id="modal-xyz"> sat
 * in the DOM from page load, hidden, and buttons anywhere in the app
 * called openModal('modal-xyz') by string id.
 *
 * Here, exactly ONE modal can be open at a time, tracked as
 * `{ name, payload }` in state — `name` is a short key ("newCert",
 * "certPreview", "print", ...), `payload` is optional data the
 * opener wants the modal to have (e.g. which print report title to
 * show). Any component, anywhere, calls `useModal().openModal(name,
 * payload)` — no ids, no DOM queries, no classList.
 *
 * <ModalRoot> (mounted once, in App.jsx) reads `activeModal` and
 * renders the matching modal component.
 * ------------------------------------------------------------------
 */

const ModalContext = createContext(undefined);

export function ModalProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null); // { name, payload } | null

  const openModal = useCallback((name, payload = null) => {
    setActiveModal({ name, payload });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  return (
    <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useModal() {
  const ctx = useContext(ModalContext);
  if (ctx === undefined) {
    throw new Error("useModal() must be used inside a <ModalProvider>");
  }
  return ctx;
}
