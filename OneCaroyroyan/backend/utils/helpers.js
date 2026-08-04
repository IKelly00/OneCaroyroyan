const pool = require("../config/db");

/** Wraps an async route handler so rejected promises reach the error middleware. */
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/** Writes a row to audit_logs. Call this from controllers after a create/update/delete. */
async function logActivity({ userId, username, action, module, status = "Success" }) {
  await pool.query(
    `INSERT INTO audit_logs (user_id, username, action, module, status) VALUES (?, ?, ?, ?, ?)`,
    [userId || null, username || "system", action, module, status]
  );
}

/**
 * Atomically reserves the next number in a numbering_series row and
 * returns the formatted document number, e.g. "CR-2026-0482".
 * Uses a transaction + row lock so concurrent requests never collide.
 */
async function nextDocumentNumber(seriesKey) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query(
      "SELECT * FROM numbering_series WHERE series_key = ? FOR UPDATE",
      [seriesKey]
    );
    if (rows.length === 0) {
      throw Object.assign(new Error(`Unknown numbering series: ${seriesKey}`), { status: 400 });
    }
    const series = rows[0];
    const seq = String(series.next_seq).padStart(series.padding, "0");
    const formatted =
      series.series_key === "resident"
        ? `${series.year}-${seq}`
        : `${series.prefix}-${series.year}-${seq}`;

    await conn.query(
      "UPDATE numbering_series SET next_seq = next_seq + 1 WHERE series_key = ?",
      [seriesKey]
    );
    await conn.commit();
    return formatted;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { asyncHandler, logActivity, nextDocumentNumber };
