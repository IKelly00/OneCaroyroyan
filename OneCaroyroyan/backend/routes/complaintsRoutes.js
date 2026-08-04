const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/complaintsController");
const { requireAuth, requireRole } = require("../middleware/auth");

const CAN_MANAGE = ["Administrator", "Barangay Secretary"];

router.use(requireAuth);
router.get("/", ctrl.getComplaints);
router.post("/", requireRole(...CAN_MANAGE), ctrl.createComplaint);
router.patch("/:id/status", requireRole(...CAN_MANAGE), ctrl.updateComplaintStatus);

module.exports = router;
