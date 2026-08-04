const pool = require("../config/db");
const { asyncHandler, logActivity, nextDocumentNumber } = require("../utils/helpers");

const getPayments = asyncHandler(async (req, res) => {
  const { search = "", validated = "", from = "", to = "", page = 1, limit = 50 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const where = [];
  const params = [];
  if (search) {
    where.push("(or_no LIKE ? OR payer LIKE ? OR cert_no LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (validated !== "") { where.push("validated = ?"); params.push(validated === "true" ? 1 : 0); }
  if (from) { where.push("payment_date >= ?"); params.push(from); }
  if (to) { where.push("payment_date <= ?"); params.push(to); }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [rows] = await pool.query(
    `SELECT * FROM payments ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, Number(limit), offset]
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM payments ${whereSql}`, params);
  res.json({ data: rows, total, page: Number(page), limit: Number(limit) });
});

// POST /api/payments  (Record Payment)
const createPayment = asyncHandler(async (req, res) => {
  const { payer, certNo = null, type, amount, paymentDate } = req.body;
  if (!payer || !type || amount === undefined) {
    return res.status(400).json({ message: "payer, type, and amount are required" });
  }

  let certificateId = null;
  if (certNo) {
    const [[cert]] = await pool.query("SELECT id FROM certificates WHERE cert_no = ?", [certNo]);
    certificateId = cert ? cert.id : null;
  }

  const orNo = await nextDocumentNumber("receipt");
  await pool.query(
    `INSERT INTO payments (or_no, payer, certificate_id, cert_no, type, amount, payment_date, validated, recorded_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
    [orNo, payer, certificateId, certNo, type, amount, paymentDate || new Date().toISOString().slice(0, 10), req.user.id]
  );

  await logActivity({
    userId: req.user.id, username: req.user.username,
    action: `Recorded Payment — ${orNo}`, module: "Payments",
  });

  const [rows] = await pool.query("SELECT * FROM payments WHERE or_no = ?", [orNo]);
  res.status(201).json(rows[0]);
});

// PATCH /api/payments/:id/validate
const validatePayment = asyncHandler(async (req, res) => {
  const [existing] = await pool.query("SELECT * FROM payments WHERE id = ?", [req.params.id]);
  if (existing.length === 0) return res.status(404).json({ message: "Payment not found" });

  await pool.query(
    "UPDATE payments SET validated = 1, validated_by = ? WHERE id = ?",
    [req.user.id, req.params.id]
  );
  await logActivity({
    userId: req.user.id, username: req.user.username,
    action: `Validated Payment ${existing[0].or_no}`, module: "Payments",
  });
  const [rows] = await pool.query("SELECT * FROM payments WHERE id = ?", [req.params.id]);
  res.json(rows[0]);
});

module.exports = { getPayments, createPayment, validatePayment };
