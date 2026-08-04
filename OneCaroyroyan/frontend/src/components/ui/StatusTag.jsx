/*
 * StatusTag
 * ------------------------------------------------------------------
 * Replaces the repeated ternary in several render*() functions, e.g.:
 *   c.digitized
 *     ? `<span class="tag-done"><svg>check</svg>Done</span>`
 *     : `<span class="tag-pend"><svg>clock</svg>Pending</span>`
 * ------------------------------------------------------------------
 */
export default function StatusTag({ done, doneLabel = "Done", pendingLabel = "Pending" }) {
  if (done) {
    return (
      <span className="tag-done">
        <svg viewBox="0 0 24 24">
          <polyline points="20,6 9,17 4,12" />
        </svg>
        {doneLabel}
      </span>
    );
  }
  return (
    <span className="tag-pend">
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
      {pendingLabel}
    </span>
  );
}
