const pool = require("../config/db");
const { asyncHandler, logActivity, nextDocumentNumber } = require("../utils/helpers");

const getComplaints = asyncHandler(async (req, res) => {
  const { search = "", status = "", page = 1, limit = 50 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const where = [];
  const params = [];
  if (search) {
    where.push("(case_no LIKE ? OR complainant LIKE ? OR respondent LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (status) { where.push("status = ?"); params.push(status); }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [rows] = await pool.query(
    `SELECT * FROM complaints ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, Number(limit), offset]
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM complaints ${whereSql}`, params);
  res.json({ data: rows, total, page: Number(page), limit: Number(limit) });
});

const createComplaint = asyncHandler(async (req, res) => {
  const { complainant, respondent, nature, kagawad = null } = req.body;
  if (!complainant || !respondent || !nature) {
    return res.status(400).json({ message: "complainant, respondent, and nature are required" });
  }

  const caseNo = await nextDocumentNumber("blotter");
  await pool.query(
    `INSERT INTO complaints (case_no, complainant, respondent, nature, kagawad, status, filed_date, filed_by)
     VALUES (?, ?, ?, ?, ?, 'Pending', CURDATE(), ?)`,
    [caseNo, complainant, respondent, nature, kagawad, req.user.id]
  );

  await logActivity({
    userId: req.user.id, username: req.user.username,
    action: `Filed Blotter Case ${caseNo}`, module: "Complaints",
  });

  const [rows] = await pool.query("SELECT * FROM complaints WHERE case_no = ?", [caseNo]);
  res.status(201).json(rows[0]);
});

const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const valid = ["Pending", "Under Mediation", "Resolved", "Referred to PNP"];
  if (!valid.includes(status)) {
    return res.status(400).json({ message: `status must be one of: ${valid.join(", ")}` });
  }

  const [existing] = await pool.query("SELECT * FROM complaints WHERE id = ?", [req.params.id]);
  if (existing.length === 0) return res.status(404).json({ message: "Complaint not found" });

  await pool.query("UPDATE complaints SET status = ? WHERE id = ?", [status, req.params.id]);
  await logActivity({
    userId: req.user.id, username: req.user.username,
    action: `Updated Blotter ${existing[0].case_no} to "${status}"`, module: "Complaints",
  });

  const [rows] = await pool.query("SELECT * FROM complaints WHERE id = ?", [req.params.id]);
  res.json(rows[0]);
});

module.exports = { getComplaints, createComplaint, updateComplaintStatus };
