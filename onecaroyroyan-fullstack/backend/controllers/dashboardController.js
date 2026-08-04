const pool = require("../config/db");
const { asyncHandler } = require("../utils/helpers");

// GET /api/dashboard/admin
const getAdminDashboard = asyncHandler(async (req, res) => {
  const [[requestsToday]] = await pool.query(
    "SELECT COUNT(*) AS c FROM certificates WHERE request_date = CURDATE()"
  );
  const [[forVerification]] = await pool.query(
    "SELECT COUNT(*) AS c FROM certificates WHERE status = 'For Verification'"
  );
  const [[issuedToday]] = await pool.query(
    "SELECT COUNT(*) AS c FROM certificates WHERE issued_date = CURDATE()"
  );
  const [[pending]] = await pool.query(
    "SELECT COUNT(*) AS c FROM certificates WHERE status = 'Pending'"
  );
  const [[totalResidents]] = await pool.query(
    "SELECT COUNT(*) AS c FROM residents WHERE status = 'Active'"
  );
  const [queue] = await pool.query(
    "SELECT * FROM certificates WHERE status IN ('Pending','For Verification','Processing') ORDER BY request_date DESC LIMIT 20"
  );

  res.json({
    requestsToday: requestsToday.c,
    forVerification: forVerification.c,
    certsIssuedToday: issuedToday.c,
    pendingRequests: pending.c,
    totalResidents: totalResidents.c,
    certQueue: queue,
  });
});

// GET /api/dashboard/secretary
const getSecretaryDashboard = asyncHandler(async (req, res) => {
  const [[corrTotal]] = await pool.query("SELECT COUNT(*) AS c FROM correspondence");
  const [[corrForAction]] = await pool.query("SELECT COUNT(*) AS c FROM correspondence WHERE status = 'For Action'");
  const [[blotterOpen]] = await pool.query(
    "SELECT COUNT(*) AS c FROM complaints WHERE status IN ('Pending','Under Mediation')"
  );
  const [[blotterResolved]] = await pool.query("SELECT COUNT(*) AS c FROM complaints WHERE status = 'Resolved'");
  const [recentCorrespondence] = await pool.query(
    "SELECT * FROM correspondence ORDER BY received_date DESC, id DESC LIMIT 10"
  );
  const [recentComplaints] = await pool.query(
    "SELECT * FROM complaints ORDER BY filed_date DESC, id DESC LIMIT 10"
  );

  res.json({
    correspondenceTotal: corrTotal.c,
    correspondenceForAction: corrForAction.c,
    blotterOpenCases: blotterOpen.c,
    blotterResolved: blotterResolved.c,
    recentCorrespondence,
    recentComplaints,
  });
});

// GET /api/dashboard/accounting
const getAccountingDashboard = asyncHandler(async (req, res) => {
  const [[todayTotal]] = await pool.query(
    "SELECT COALESCE(SUM(amount),0) AS total, COUNT(*) AS c FROM payments WHERE payment_date = CURDATE()"
  );
  const [[pendingValidation]] = await pool.query("SELECT COUNT(*) AS c FROM payments WHERE validated = 0");
  const [[monthTotal]] = await pool.query(
    "SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE MONTH(payment_date) = MONTH(CURDATE()) AND YEAR(payment_date) = YEAR(CURDATE())"
  );
  const [recentPayments] = await pool.query("SELECT * FROM payments ORDER BY payment_date DESC, id DESC LIMIT 15");

  res.json({
    collectionsToday: Number(todayTotal.total),
    transactionsToday: todayTotal.c,
    pendingValidation: pendingValidation.c,
    collectionsThisMonth: Number(monthTotal.total),
    recentPayments,
  });
});

// GET /api/dashboard/treasurer
const getTreasurerDashboard = asyncHandler(async (req, res) => {
  const [[monthCollections]] = await pool.query(
    "SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE MONTH(payment_date) = MONTH(CURDATE()) AND YEAR(payment_date) = YEAR(CURDATE()) AND validated = 1"
  );
  const [[unvalidated]] = await pool.query(
    "SELECT COALESCE(SUM(amount),0) AS total, COUNT(*) AS c FROM payments WHERE validated = 0"
  );
  const [byType] = await pool.query(
    `SELECT type, COUNT(*) AS count, COALESCE(SUM(amount),0) AS total
     FROM payments GROUP BY type ORDER BY total DESC`
  );
  const [monthly] = await pool.query(
    `SELECT DATE_FORMAT(payment_date, '%Y-%m') AS month, COALESCE(SUM(amount),0) AS total, COUNT(*) AS count
     FROM payments
     WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
     GROUP BY month ORDER BY month ASC`
  );

  res.json({
    validatedCollectionsThisMonth: Number(monthCollections.total),
    unvalidatedAmount: Number(unvalidated.total),
    unvalidatedCount: unvalidated.c,
    collectionsByType: byType,
    monthlyTrend: monthly,
  });
});

// GET /api/dashboard/captain
const getCaptainDashboard = asyncHandler(async (req, res) => {
  const [[residents]] = await pool.query("SELECT COUNT(*) AS c FROM residents WHERE status = 'Active'");
  const [[certsThisMonth]] = await pool.query(
    "SELECT COUNT(*) AS c FROM certificates WHERE MONTH(request_date) = MONTH(CURDATE()) AND YEAR(request_date) = YEAR(CURDATE())"
  );
  const [[collections]] = await pool.query(
    "SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE MONTH(payment_date) = MONTH(CURDATE()) AND YEAR(payment_date) = YEAR(CURDATE())"
  );
  const [[openCases]] = await pool.query(
    "SELECT COUNT(*) AS c FROM complaints WHERE status IN ('Pending','Under Mediation')"
  );
  const [[correspondencePending]] = await pool.query(
    "SELECT COUNT(*) AS c FROM correspondence WHERE status IN ('Received','For Action')"
  );
  const [byPurok] = await pool.query(
    "SELECT purok, COUNT(*) AS count FROM residents WHERE status = 'Active' GROUP BY purok ORDER BY purok ASC"
  );
  const [[totalCerts]] = await pool.query("SELECT COUNT(*) AS c FROM certificates");
  const [[totalCollections]] = await pool.query("SELECT COALESCE(SUM(amount),0) AS total FROM payments");
  const [[totalComplaints]] = await pool.query("SELECT COUNT(*) AS c FROM complaints");
  const [certsByType] = await pool.query(
    "SELECT type, COUNT(*) AS count FROM certificates GROUP BY type ORDER BY count DESC"
  );
  const [complaintsByStatus] = await pool.query(
    "SELECT status, COUNT(*) AS count FROM complaints GROUP BY status"
  );

  res.json({
    totalResidents: residents.c,
    certificatesThisMonth: certsThisMonth.c,
    collectionsThisMonth: Number(collections.total),
    openBlotterCases: openCases.c,
    correspondencePending: correspondencePending.c,
    residentsByPurok: byPurok,
    totalCertsIssued: totalCerts.c,
    totalCollections: Number(totalCollections.total),
    totalComplaints: totalComplaints.c,
    certsByType,
    complaintsByStatus,
  });
});

// GET /api/dashboard/monthly-trend  (shared Chart.js data source for all dashboards)
const getMonthlyTrend = asyncHandler(async (req, res) => {
  const [certTrend] = await pool.query(
    `SELECT DATE_FORMAT(request_date, '%Y-%m') AS month, COUNT(*) AS certificates
     FROM certificates
     WHERE request_date >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
     GROUP BY month ORDER BY month ASC`
  );
  const [collectionTrend] = await pool.query(
    `SELECT DATE_FORMAT(payment_date, '%Y-%m') AS month, COALESCE(SUM(amount),0) AS collections
     FROM payments
     WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
     GROUP BY month ORDER BY month ASC`
  );

  // Merge the two series by month key
  const map = {};
  for (const row of certTrend) map[row.month] = { month: row.month, certificates: row.certificates, collections: 0 };
  for (const row of collectionTrend) {
    map[row.month] = map[row.month] || { month: row.month, certificates: 0, collections: 0 };
    map[row.month].collections = Number(row.collections);
  }
  res.json(Object.values(map).sort((a, b) => a.month.localeCompare(b.month)));
});

module.exports = {
  getAdminDashboard, getSecretaryDashboard, getAccountingDashboard,
  getTreasurerDashboard, getCaptainDashboard, getMonthlyTrend,
};
