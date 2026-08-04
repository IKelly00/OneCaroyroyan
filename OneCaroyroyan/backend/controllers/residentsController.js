const pool = require("../config/db");
const { asyncHandler, logActivity, nextDocumentNumber } = require("../utils/helpers");

// GET /api/residents?search=&purok=&status=&page=&limit=
const getResidents = asyncHandler(async (req, res) => {
  const { search = "", purok = "", status = "", page = 1, limit = 50 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const where = [];
  const params = [];
  if (search) {
    where.push("(full_name LIKE ? OR id LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  if (purok) {
    where.push("purok = ?");
    params.push(purok);
  }
  if (status) {
    where.push("status = ?");
    params.push(status);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [rows] = await pool.query(
    `SELECT * FROM residents ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, Number(limit), offset]
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM residents ${whereSql}`, params);

  res.json({ data: rows, total, page: Number(page), limit: Number(limit) });
});

// GET /api/residents/:id
const getResidentById = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM residents WHERE id = ?", [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ message: "Resident not found" });
  res.json(rows[0]);
});

// POST /api/residents
const createResident = asyncHandler(async (req, res) => {
  const { fullName, age, gender, civilStatus, purok, status = "Active" } = req.body;
  if (!fullName || !age || !gender || !civilStatus || !purok) {
    return res.status(400).json({ message: "fullName, age, gender, civilStatus, and purok are required" });
  }

  const id = await nextDocumentNumber("resident");
  await pool.query(
    `INSERT INTO residents (id, full_name, age, gender, civil_status, purok, status, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, fullName, age, gender, civilStatus, purok, status, req.user.id]
  );

  await logActivity({
    userId: req.user.id,
    username: req.user.username,
    action: `Added Resident Record ${id}`,
    module: "Residents",
  });

  const [rows] = await pool.query("SELECT * FROM residents WHERE id = ?", [id]);
  res.status(201).json(rows[0]);
});

// PUT /api/residents/:id
const updateResident = asyncHandler(async (req, res) => {
  const { fullName, age, gender, civilStatus, purok, status } = req.body;
  const [existing] = await pool.query("SELECT * FROM residents WHERE id = ?", [req.params.id]);
  if (existing.length === 0) return res.status(404).json({ message: "Resident not found" });

  await pool.query(
    `UPDATE residents SET
       full_name = COALESCE(?, full_name),
       age = COALESCE(?, age),
       gender = COALESCE(?, gender),
       civil_status = COALESCE(?, civil_status),
       purok = COALESCE(?, purok),
       status = COALESCE(?, status)
     WHERE id = ?`,
    [fullName, age, gender, civilStatus, purok, status, req.params.id]
  );

  await logActivity({
    userId: req.user.id,
    username: req.user.username,
    action: `Updated Resident Record ${req.params.id}`,
    module: "Residents",
  });

  const [rows] = await pool.query("SELECT * FROM residents WHERE id = ?", [req.params.id]);
  res.json(rows[0]);
});

// DELETE /api/residents/:id
const deleteResident = asyncHandler(async (req, res) => {
  const [result] = await pool.query("DELETE FROM residents WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "Resident not found" });

  await logActivity({
    userId: req.user.id,
    username: req.user.username,
    action: `Deleted Resident Record ${req.params.id}`,
    module: "Residents",
  });

  res.status(204).send();
});

module.exports = { getResidents, getResidentById, createResident, updateResident, deleteResident };
