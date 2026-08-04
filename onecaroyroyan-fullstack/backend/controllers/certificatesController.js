const pool = require("../config/db");
const { asyncHandler, logActivity, nextDocumentNumber } = require("../utils/helpers");

const getCertificates = asyncHandler(async (req, res) => {
  const { search = "", status = "", type = "", page = 1, limit = 50 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const where = [];
  const params = [];
  if (search) {
    where.push("(cert_no LIKE ? OR resident_name LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  if (status) { where.push("status = ?"); params.push(status); }
  if (type) { where.push("type = ?"); params.push(type); }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [rows] = await pool.query(
    `SELECT * FROM certificates ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, Number(limit), offset]
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM certificates ${whereSql}`, params);
  res.json({ data: rows, total, page: Number(page), limit: Number(limit) });
});

const getCertificateById = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM certificates WHERE id = ?", [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ message: "Certificate not found" });
  res.json(rows[0]);
});

// POST /api/certificates  (New Cert Request)
const createCertificate = asyncHandler(async (req, res) => {
  const { residentId = null, residentName, type, purpose, fee } = req.body;
  if (!residentName || !type || !purpose) {
    return res.status(400).json({ message: "residentName, type, and purpose are required" });
  }

  let feeAmount = fee;
  if (feeAmount === undefined || feeAmount === null) {
    const [[feeRow]] = await pool.query("SELECT fee FROM fees WHERE cert_type = ?", [type]);
    feeAmount = feeRow ? feeRow.fee : 0;
  }

  const certNo = await nextDocumentNumber("certificate");
  await pool.query(
    `INSERT INTO certificates (cert_no, resident_id, resident_name, type, purpose, fee, status, verified, request_date)
     VALUES (?, ?, ?, ?, ?, ?, 'Pending', 0, CURDATE())`,
    [certNo, residentId, residentName, type, purpose, feeAmount]
  );

  await logActivity({
    userId: req.user.id, username: req.user.username,
    action: `Created Certificate Request ${certNo}`, module: "Certificates",
  });

  const [rows] = await pool.query("SELECT * FROM certificates WHERE cert_no = ?", [certNo]);
  res.status(201).json(rows[0]);
});

// PATCH /api/certificates/:id/verify
const verifyCertificate = asyncHandler(async (req, res) => {
  const [existing] = await pool.query("SELECT * FROM certificates WHERE id = ?", [req.params.id]);
  if (existing.length === 0) return res.status(404).json({ message: "Certificate not found" });

  await pool.query(
    "UPDATE certificates SET verified = 1, status = 'Processing' WHERE id = ?",
    [req.params.id]
  );
  await logActivity({
    userId: req.user.id, username: req.user.username,
    action: `Verified Certificate ${existing[0].cert_no}`, module: "Certificates",
  });
  const [rows] = await pool.query("SELECT * FROM certificates WHERE id = ?", [req.params.id]);
  res.json(rows[0]);
});

// PATCH /api/certificates/:id/issue
const issueCertificate = asyncHandler(async (req, res) => {
  const [existing] = await pool.query("SELECT * FROM certificates WHERE id = ?", [req.params.id]);
  if (existing.length === 0) return res.status(404).json({ message: "Certificate not found" });

  await pool.query(
    "UPDATE certificates SET status = 'Issued', issued_date = CURDATE(), issued_by = ? WHERE id = ?",
    [req.user.id, req.params.id]
  );
  await logActivity({
    userId: req.user.id, username: req.user.username,
    action: `Issued Certificate ${existing[0].cert_no}`, module: "Certificates",
  });
  const [rows] = await pool.query("SELECT * FROM certificates WHERE id = ?", [req.params.id]);
  res.json(rows[0]);
});

// PATCH /api/certificates/:id/cancel
const cancelCertificate = asyncHandler(async (req, res) => {
  const [existing] = await pool.query("SELECT * FROM certificates WHERE id = ?", [req.params.id]);
  if (existing.length === 0) return res.status(404).json({ message: "Certificate not found" });

  await pool.query("UPDATE certificates SET status = 'Cancelled' WHERE id = ?", [req.params.id]);
  await logActivity({
    userId: req.user.id, username: req.user.username,
    action: `Cancelled Certificate ${existing[0].cert_no}`, module: "Certificates",
  });
  const [rows] = await pool.query("SELECT * FROM certificates WHERE id = ?", [req.params.id]);
  res.json(rows[0]);
});

module.exports = {
  getCertificates, getCertificateById, createCertificate,
  verifyCertificate, issueCertificate, cancelCertificate,
};
