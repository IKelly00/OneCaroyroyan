const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const { asyncHandler, logActivity } = require("../utils/helpers");

/* ---------- Barangay Information ---------- */
const getBarangayInfo = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM barangay_info WHERE id = 1");
  res.json(rows[0] || null);
});

const updateBarangayInfo = asyncHandler(async (req, res) => {
  const { barangayName, municipality, province, region, barangayCode, contactNo, email, address } = req.body;
  await pool.query(
    `UPDATE barangay_info SET
       barangay_name = COALESCE(?, barangay_name),
       municipality  = COALESCE(?, municipality),
       province      = COALESCE(?, province),
       region        = COALESCE(?, region),
       barangay_code = COALESCE(?, barangay_code),
       contact_no    = COALESCE(?, contact_no),
       email         = COALESCE(?, email),
       address       = COALESCE(?, address)
     WHERE id = 1`,
    [barangayName, municipality, province, region, barangayCode, contactNo, email, address]
  );
  await logActivity({ userId: req.user.id, username: req.user.username, action: "Updated Barangay Information", module: "Settings" });
  const [rows] = await pool.query("SELECT * FROM barangay_info WHERE id = 1");
  res.json(rows[0]);
});

/* ---------- Officials ---------- */
const getOfficials = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM officials ORDER BY sort_order ASC");
  res.json(rows);
});

const updateOfficial = asyncHandler(async (req, res) => {
  const { fullName } = req.body;
  if (!fullName) return res.status(400).json({ message: "fullName is required" });

  const [result] = await pool.query(
    "UPDATE officials SET full_name = ? WHERE position_key = ?",
    [fullName, req.params.key]
  );
  if (result.affectedRows === 0) return res.status(404).json({ message: "Official not found" });

  await logActivity({ userId: req.user.id, username: req.user.username, action: `Updated Official "${req.params.key}"`, module: "Settings" });
  const [rows] = await pool.query("SELECT * FROM officials WHERE position_key = ?", [req.params.key]);
  res.json(rows[0]);
});

/* ---------- Signatories ---------- */
const getSignatories = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM signatories");
  res.json(rows);
});

const updateSignatory = asyncHandler(async (req, res) => {
  const { value } = req.body;
  if (!value) return res.status(400).json({ message: "value is required" });

  const [result] = await pool.query(
    "UPDATE signatories SET value = ? WHERE signatory_key = ?",
    [value, req.params.key]
  );
  if (result.affectedRows === 0) return res.status(404).json({ message: "Signatory not found" });

  await logActivity({ userId: req.user.id, username: req.user.username, action: `Updated Signatory "${req.params.key}"`, module: "Settings" });
  const [rows] = await pool.query("SELECT * FROM signatories WHERE signatory_key = ?", [req.params.key]);
  res.json(rows[0]);
});

/* ---------- Fees ---------- */
const getFees = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM fees ORDER BY cert_type ASC");
  res.json(rows);
});

const updateFee = asyncHandler(async (req, res) => {
  const { fee, indigentRate } = req.body;
  const [result] = await pool.query(
    "UPDATE fees SET fee = COALESCE(?, fee), indigent_rate = COALESCE(?, indigent_rate) WHERE id = ?",
    [fee, indigentRate, req.params.id]
  );
  if (result.affectedRows === 0) return res.status(404).json({ message: "Fee row not found" });

  await logActivity({ userId: req.user.id, username: req.user.username, action: `Updated Fee Schedule #${req.params.id}`, module: "Settings" });
  const [rows] = await pool.query("SELECT * FROM fees WHERE id = ?", [req.params.id]);
  res.json(rows[0]);
});

/* ---------- Certificate Templates ---------- */
const getCertTemplates = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM cert_templates ORDER BY name ASC");
  res.json(rows);
});

const updateCertTemplate = asyncHandler(async (req, res) => {
  const { validity } = req.body;
  const valid = ["6 Months", "1 Year", "One-time use"];
  if (!valid.includes(validity)) return res.status(400).json({ message: `validity must be one of: ${valid.join(", ")}` });

  const [result] = await pool.query("UPDATE cert_templates SET validity = ? WHERE id = ?", [validity, req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "Template not found" });

  await logActivity({ userId: req.user.id, username: req.user.username, action: `Updated Certificate Template #${req.params.id}`, module: "Settings" });
  const [rows] = await pool.query("SELECT * FROM cert_templates WHERE id = ?", [req.params.id]);
  res.json(rows[0]);
});

/* ---------- Numbering Series ---------- */
const getNumberingSeries = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM numbering_series");
  res.json(rows);
});

const updateNumberingSeries = asyncHandler(async (req, res) => {
  const { prefix, year, nextSeq } = req.body;
  const [result] = await pool.query(
    `UPDATE numbering_series SET
       prefix = COALESCE(?, prefix), year = COALESCE(?, year), next_seq = COALESCE(?, next_seq)
     WHERE series_key = ?`,
    [prefix, year, nextSeq, req.params.key]
  );
  if (result.affectedRows === 0) return res.status(404).json({ message: "Series not found" });

  await logActivity({ userId: req.user.id, username: req.user.username, action: `Updated Numbering Series "${req.params.key}"`, module: "Settings" });
  const [rows] = await pool.query("SELECT * FROM numbering_series WHERE series_key = ?", [req.params.key]);
  res.json(rows[0]);
});

/* ---------- Users (Admin-only account management) ---------- */
const getUsers = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, user_code, full_name, username, role, status, last_login FROM users ORDER BY id ASC"
  );
  res.json(rows);
});

const createUser = asyncHandler(async (req, res) => {
  const { fullName, username, password, role } = req.body;
  const validRoles = ["Administrator", "Barangay Secretary", "Accounting Clerk", "Treasurer", "Barangay Captain"];
  if (!fullName || !username || !password || !validRoles.includes(role)) {
    return res.status(400).json({ message: `fullName, username, password, and a valid role (${validRoles.join(", ")}) are required` });
  }
  if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });

  const [[{ maxId }]] = await pool.query("SELECT COALESCE(MAX(id), 0) AS maxId FROM users");
  const userCode = `USR-${String(maxId + 1).padStart(3, "0")}`;
  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO users (user_code, full_name, username, password_hash, role, status)
     VALUES (?, ?, ?, ?, ?, 'Active')`,
    [userCode, fullName, username, hash, role]
  );

  await logActivity({ userId: req.user.id, username: req.user.username, action: `Added User Account ${userCode} (${username})`, module: "Users" });
  const [rows] = await pool.query("SELECT id, user_code, full_name, username, role, status FROM users WHERE user_code = ?", [userCode]);
  res.status(201).json(rows[0]);
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["Active", "Inactive"].includes(status)) return res.status(400).json({ message: "status must be Active or Inactive" });

  const [result] = await pool.query("UPDATE users SET status = ? WHERE id = ?", [status, req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });

  await logActivity({ userId: req.user.id, username: req.user.username, action: `Set user #${req.params.id} status to ${status}`, module: "Users" });
  res.json({ message: "Updated" });
});

const resetUserPassword = asyncHandler(async (req, res) => {
  const tempPassword = Math.random().toString(36).slice(-10) + "!A1";
  const hash = await bcrypt.hash(tempPassword, 10);

  const [result] = await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });

  await logActivity({ userId: req.user.id, username: req.user.username, action: `Reset password for user #${req.params.id}`, module: "Users" });
  // Returned once, over an authenticated admin-only channel, so the admin can relay it to the user.
  res.json({ message: "Password reset", temporaryPassword: tempPassword });
});

/* ---------- Backup & Audit Logs ---------- */
const getAuditLogs = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query;
  const [rows] = await pool.query(
    "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?",
    [Number(limit)]
  );
  res.json(rows);
});

const getLastBackup = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM backups ORDER BY created_at DESC LIMIT 1");
  res.json(rows[0] || null);
});

const triggerBackup = asyncHandler(async (req, res) => {
  await pool.query(
    "INSERT INTO backups (triggered_by, status, note) VALUES (?, 'Success', 'Manual backup triggered from Settings')",
    [req.user.id]
  );
  await logActivity({ userId: req.user.id, username: req.user.username, action: "Triggered manual backup", module: "Backup" });
  const [rows] = await pool.query("SELECT * FROM backups ORDER BY created_at DESC LIMIT 1");
  res.status(201).json(rows[0]);
});

module.exports = {
  getBarangayInfo, updateBarangayInfo,
  getOfficials, updateOfficial,
  getSignatories, updateSignatory,
  getFees, updateFee,
  getCertTemplates, updateCertTemplate,
  getNumberingSeries, updateNumberingSeries,
  getUsers, createUser, updateUserStatus, resetUserPassword,
  getAuditLogs, getLastBackup, triggerBackup,
};
