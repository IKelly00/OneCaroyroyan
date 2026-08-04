const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { asyncHandler, logActivity } = require("../utils/helpers");

const signToken = (user) =>
  jwt.sign(
    { id: user.id, username: user.username, role: user.role, fullName: user.full_name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  );

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
  const user = rows[0];

  if (!user || user.status !== "Active") {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    await logActivity({ username, action: "Failed login attempt", module: "Auth", status: "Failed" });
    return res.status(401).json({ message: "Invalid username or password" });
  }

  await pool.query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id]);
  await logActivity({ userId: user.id, username: user.username, action: "Logged in", module: "Auth" });

  const token = signToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      userCode: user.user_code,
      fullName: user.full_name,
      username: user.username,
      role: user.role,
    },
  });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, user_code, full_name, username, role, status, last_login FROM users WHERE id = ?",
    [req.user.id]
  );
  if (rows.length === 0) return res.status(404).json({ message: "User not found" });
  res.json(rows[0]);
});

// POST /api/auth/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "currentPassword and newPassword are required" });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: "New password must be at least 8 characters" });
  }

  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
  const user = rows[0];
  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) return res.status(401).json({ message: "Current password is incorrect" });

  const hash = await bcrypt.hash(newPassword, 10);
  await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, user.id]);
  await logActivity({ userId: user.id, username: user.username, action: "Changed password", module: "Auth" });

  res.json({ message: "Password updated" });
});

module.exports = { login, me, changePassword };
