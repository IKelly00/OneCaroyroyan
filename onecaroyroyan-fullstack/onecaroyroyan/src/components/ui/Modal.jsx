/*
 * Modal
 * ------------------------------------------------------------------
 * Generic overlay + dialog shell, replacing the repeated
 * <div class="modal-overlay"><div class="modal"> markup that every
 * one of the original's 8 modals hand-rolled individually. Specific
 * modals (NewCertModal, PrintModal, etc.) provide `title` and
 * `children` (body) and `footer` (the action buttons).
 *
 * Clicking the overlay itself (not the dialog) closes it, matching
 * the original's onclick="closeModal('modal-x')" on .modal-overlay.
 * ------------------------------------------------------------------
 */
export default function Modal({ title, onClose, children, footer, size = "md" }) {
  return (
    <div
      className="modal-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal modal-${size}`}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Close">
            <svg viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
