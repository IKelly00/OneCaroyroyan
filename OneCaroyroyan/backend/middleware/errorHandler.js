// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ message: "A record with that identifier already exists." });
  }
  if (err.code && err.code.startsWith("ER_")) {
    return res.status(400).json({ message: "Database error", detail: err.sqlMessage || err.message });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
}

module.exports = errorHandler;
