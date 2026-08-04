const pool = require("../config/db");
const { asyncHandler, logActivity, nextDocumentNumber } = require("../utils/helpers");

const getCorrespondence = asyncHandler(async (req, res) => {
  const { search = "", status = "", page = 1, limit = 50 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const where = [];
  const params = [];
  if (search) {
    where.push("(track_no LIKE ? OR sender LIKE ? OR subject LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (status) { where.push("status = ?"); params.push(status); }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [rows] = await pool.query(
    `SELECT * FROM correspondence ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, Number(limit), offset]
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM correspondence ${whereSql}`, params);
  res.json({ data: rows, total, page: Number(page), limit: Number(limit) });
});

const createCorrespondence = asyncHandler(async (req, res) => {
  const { sender, type, subject, digitized = false } = req.body;
  if (!sender || !type || !subject) {
    return res.status(400).json({ message: "sender, type, and subject are required" });
  }

  const trackNo = await nextDocumentNumber("correspondence");
  await pool.query(
    `INSERT INTO correspondence (track_no, sender, type, subject, status, digitized, received_date, logged_by)
     VALUES (?, ?, ?, ?, 'Received', ?, CURDATE(), ?)`,
    [trackNo, sender, type, subject, digitized ? 1 : 0, req.user.id]
  );

  await logActivity({
    userId: req.user.id, username: req.user.username,
    action: `Logged Correspondence ${trackNo}`, module: "Correspondence",
  });

  const [rows] = await pool.query("SELECT * FROM correspondence WHERE track_no = ?", [trackNo]);
  res.status(201).json(rows[0]);
});

const updateCorrespondenceStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const valid = ["Received", "For Action", "Acknowledged", "Filed"];
  if (!valid.includes(status)) {
    return res.status(400).json({ message: `status must be one of: ${valid.join(", ")}` });
  }

  const [existing] = await pool.query("SELECT * FROM correspondence WHERE id = ?", [req.params.id]);
  if (existing.length === 0) return res.status(404).json({ message: "Correspondence not found" });

  await pool.query("UPDATE correspondence SET status = ? WHERE id = ?", [status, req.params.id]);
  await logActivity({
    userId: req.user.id, username: req.user.username,
    action: `Updated Correspondence ${existing[0].track_no} to "${status}"`, module: "Correspondence",
  });

  const [rows] = await pool.query("SELECT * FROM correspondence WHERE id = ?", [req.params.id]);
  res.json(rows[0]);
});

module.exports = { getCorrespondence, createCorrespondence, updateCorrespondenceStatus };
