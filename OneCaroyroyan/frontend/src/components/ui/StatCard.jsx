/*
 * StatCard
 * ------------------------------------------------------------------
 * Replaces the repeated `.stat-card` markup blocks, e.g.:
 *   <div class="stat-card">
 *     <div class="stat-icon bg-blue"><svg>...</svg></div>
 *     <div><div class="stat-label">Requests Today</div>
 *          <div class="stat-value">7</div>
 *          <div class="stat-sub">2 for verification</div></div>
 *   </div>
 * `icon` is raw SVG markup (path/rect/etc children only — no outer
 * <svg> tag) so callers can keep using the exact original paths.
 * ------------------------------------------------------------------
 */
export default function StatCard({ icon, color = "bg-blue", label, value, sub, trend }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: icon }} />
      </div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
      {trend && (
        <div
          style={{
            marginLeft: "auto",
            fontSize: 11,
            fontWeight: 700,
            color: "#059669",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {trend}
        </div>
      )}
    </div>
  );
}
