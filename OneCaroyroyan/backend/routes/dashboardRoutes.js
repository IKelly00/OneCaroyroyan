const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/dashboardController");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);
router.get("/admin", ctrl.getAdminDashboard);
router.get("/secretary", ctrl.getSecretaryDashboard);
router.get("/accounting", ctrl.getAccountingDashboard);
router.get("/treasurer", ctrl.getTreasurerDashboard);
router.get("/captain", ctrl.getCaptainDashboard);
router.get("/monthly-trend", ctrl.getMonthlyTrend);

module.exports = router;
