const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/settingsController");
const { requireAuth, requireRole } = require("../middleware/auth");

const ADMIN_ONLY = requireRole("Administrator");

router.use(requireAuth);

// Barangay Information — Admin + Secretary can edit, everyone can view
router.get("/barangay-info", ctrl.getBarangayInfo);
router.put("/barangay-info", requireRole("Administrator", "Barangay Secretary"), ctrl.updateBarangayInfo);

// Officials directory
router.get("/officials", ctrl.getOfficials);
router.put("/officials/:key", requireRole("Administrator", "Barangay Secretary"), ctrl.updateOfficial);

// Document signatories
router.get("/signatories", ctrl.getSignatories);
router.put("/signatories/:key", requireRole("Administrator", "Barangay Secretary"), ctrl.updateSignatory);

// Fee schedule — requires Admin or Treasurer (Sangguniang-approved rates)
router.get("/fees", ctrl.getFees);
router.put("/fees/:id", requireRole("Administrator", "Treasurer"), ctrl.updateFee);

// Certificate templates
router.get("/cert-templates", ctrl.getCertTemplates);
router.put("/cert-templates/:id", requireRole("Administrator", "Barangay Secretary"), ctrl.updateCertTemplate);

// Document numbering series
router.get("/numbering", ctrl.getNumberingSeries);
router.put("/numbering/:key", ADMIN_ONLY, ctrl.updateNumberingSeries);

// User accounts — Administrator only
router.get("/users", ADMIN_ONLY, ctrl.getUsers);
router.post("/users", ADMIN_ONLY, ctrl.createUser);
router.patch("/users/:id/status", ADMIN_ONLY, ctrl.updateUserStatus);
router.post("/users/:id/reset-password", ADMIN_ONLY, ctrl.resetUserPassword);

// Backup & audit logs
router.get("/audit-logs", ctrl.getAuditLogs);
router.get("/backup/last", ctrl.getLastBackup);
router.post("/backup", ADMIN_ONLY, ctrl.triggerBackup);

module.exports = router;
