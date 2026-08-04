const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/residentsController");
const { requireAuth, requireRole } = require("../middleware/auth");

const CAN_EDIT = ["Administrator", "Barangay Secretary"];

router.use(requireAuth);
router.get("/", ctrl.getResidents);
router.get("/:id", ctrl.getResidentById);
router.post("/", requireRole(...CAN_EDIT), ctrl.createResident);
router.put("/:id", requireRole(...CAN_EDIT), ctrl.updateResident);
router.delete("/:id", requireRole("Administrator"), ctrl.deleteResident);

module.exports = router;
