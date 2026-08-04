const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/correspondenceController");
const { requireAuth, requireRole } = require("../middleware/auth");

const CAN_MANAGE = ["Administrator", "Barangay Secretary"];

router.use(requireAuth);
router.get("/", ctrl.getCorrespondence);
router.post("/", requireRole(...CAN_MANAGE), ctrl.createCorrespondence);
router.patch("/:id/status", requireRole(...CAN_MANAGE), ctrl.updateCorrespondenceStatus);

module.exports = router;
