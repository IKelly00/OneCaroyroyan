const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/certificatesController");
const { requireAuth, requireRole } = require("../middleware/auth");

const CAN_MANAGE = ["Administrator", "Barangay Secretary"];

router.use(requireAuth);
router.get("/", ctrl.getCertificates);
router.get("/:id", ctrl.getCertificateById);
router.post("/", requireRole(...CAN_MANAGE), ctrl.createCertificate);
router.patch("/:id/verify", requireRole(...CAN_MANAGE), ctrl.verifyCertificate);
router.patch("/:id/issue", requireRole(...CAN_MANAGE), ctrl.issueCertificate);
router.patch("/:id/cancel", requireRole(...CAN_MANAGE), ctrl.cancelCertificate);

module.exports = router;
