require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const residentsRoutes = require("./routes/residentsRoutes");
const certificatesRoutes = require("./routes/certificatesRoutes");
const paymentsRoutes = require("./routes/paymentsRoutes");
const complaintsRoutes = require("./routes/complaintsRoutes");
const correspondenceRoutes = require("./routes/correspondenceRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Basic rate limiting on auth to slow down brute-force login attempts
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
app.use("/api/auth/login", authLimiter);

app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/residents", residentsRoutes);
app.use("/api/certificates", certificatesRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/complaints", complaintsRoutes);
app.use("/api/correspondence", correspondenceRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => res.status(404).json({ message: "Not found" }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`OneCaroyroyan API listening on http://localhost:${PORT}`);
});
